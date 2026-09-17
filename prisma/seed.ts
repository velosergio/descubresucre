import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { encodeRasterImageToWebp, GALLERY_WEBP_MAX_EDGE } from "../src/lib/encode-image-webp";
import { prisma } from "../src/lib/prisma";
import { decideSeedMerge, mergeJoinIds } from "../src/lib/sucre-natural-seed-merge";
import { QUE_HACER_SEED_ITEMS } from "./data/que-hacer-seed";
import {
  SEED_DESTINATIONS,
  SEED_EXPERIENCES,
  SEED_HUBS,
  SEED_SOURCES,
  SEED_SPECIES,
} from "./data/sucre-natural-seed";

/**
 * Seed: roles base (admin, editor) + Sucre Natural + Qué hacer.
 * Reejecutar es seguro (idempotente por slug; no pisa filas con seedManaged=false).
 * Para crear el primer usuario admin: npm run admin:create
 */
async function seedRoles() {
  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });
  await prisma.role.upsert({
    where: { name: "editor" },
    update: {},
    create: { name: "editor" },
  });
}

export async function seedSucreNatural(db: typeof prisma = prisma) {
  let created = 0;
  let updated = 0;
  let skippedManaged = 0;
  let itemErrors = 0;

  await Promise.all(
    SEED_HUBS.map((hub) =>
      db.sucreNaturalHub.upsert({
        where: { id: hub.id },
        create: {
          id: hub.id,
          title: hub.title,
          tagline: hub.tagline,
          introMarkdown: hub.introMarkdown,
          sortOrder: hub.sortOrder,
        },
        update: {
          title: hub.title,
          tagline: hub.tagline,
          introMarkdown: hub.introMarkdown,
          sortOrder: hub.sortOrder,
        },
      }),
    ),
  );

  const sourceIdBySlug = new Map<string, string>();
  await Promise.all(
    SEED_SOURCES.map(async (src) => {
      const row = await db.contentSource.upsert({
        where: { slug: src.slug },
        create: src,
        update: { name: src.name, url: src.url, note: src.note },
      });
      sourceIdBySlug.set(src.slug, row.id);
    }),
  );

  async function connectDestJoins(destinationId: string, hubIds: string[], sourceSlugs: string[]) {
    const existingHubs = await db.imperdibleDestinationHub.findMany({
      where: { destinationId },
    });
    const hubMerged = mergeJoinIds(
      existingHubs.map((h) => h.hubId),
      hubIds,
    );
    const existingHubSet = new Set(existingHubs.map((h) => h.hubId));
    const hubsToAdd = hubMerged.filter((hubId) => !existingHubSet.has(hubId));
    if (hubsToAdd.length) {
      await db.imperdibleDestinationHub.createMany({
        data: hubsToAdd.map((hubId) => ({ destinationId, hubId })),
        skipDuplicates: true,
      });
    }
    const existingSources = await db.destinationSource.findMany({
      where: { destinationId },
    });
    const sourceIds = sourceSlugs
      .map((s) => sourceIdBySlug.get(s))
      .filter((id): id is string => Boolean(id));
    const sourceMerged = mergeJoinIds(
      existingSources.map((s) => s.sourceId),
      sourceIds,
    );
    const existingSourceSet = new Set(existingSources.map((s) => s.sourceId));
    const sourcesToAdd = sourceMerged.filter((sourceId) => !existingSourceSet.has(sourceId));
    if (sourcesToAdd.length) {
      await db.destinationSource.createMany({
        data: sourcesToAdd.map((sourceId) => ({ destinationId, sourceId })),
        skipDuplicates: true,
      });
    }
  }

  await Promise.all(
    SEED_DESTINATIONS.map(async (dest) => {
      try {
        const existing = await db.imperdibleDestination.findUnique({
          where: { slug: dest.slug },
        });
        const decision = decideSeedMerge(existing);
        const payload = {
          title: dest.title,
          subtitle: dest.subtitle,
          bodyMarkdown: dest.specialWhy,
          municipality: dest.municipality,
          region: dest.region,
          locationLabel: dest.locationLabel,
          ecosystems: dest.ecosystems,
          approach: dest.approach,
          specialWhy: dest.specialWhy,
          howToArrive: dest.howToArrive,
          climate: dest.climate,
          recommendedTime: dest.recommendedTime,
          audience: dest.audience,
          mapNote: dest.mapNote,
          liveActivities: dest.liveActivities,
          responsibleTips: dest.responsibleTips,
          biodiversityChipLabels: dest.biodiversityChipLabels,
          published: true,
          showOnHome: false,
          seedManaged: true,
        };
        if (decision === "create") {
          const row = await db.imperdibleDestination.create({
            data: { slug: dest.slug, ...payload },
          });
          await connectDestJoins(row.id, dest.hubIds, dest.sourceSlugs);
          created += 1;
        } else if (decision === "update" && existing) {
          await db.imperdibleDestination.update({
            where: { id: existing.id },
            data: payload,
          });
          await connectDestJoins(existing.id, dest.hubIds, dest.sourceSlugs);
          updated += 1;
        } else if (existing) {
          await connectDestJoins(existing.id, dest.hubIds, dest.sourceSlugs);
          skippedManaged += 1;
        }
      } catch (e) {
        itemErrors += 1;
        console.error("seedSucreNatural destination", dest.slug, e);
      }
    }),
  );

  const destIdBySlug = new Map(
    (await db.imperdibleDestination.findMany({ select: { id: true, slug: true } })).map((d) => [
      d.slug,
      d.id,
    ]),
  );

  for (const sp of SEED_SPECIES) {
    try {
      const existing = await db.biodiversityEntry.findUnique({ where: { slug: sp.slug } });
      const decision = decideSeedMerge(existing);
      const data = {
        kind: sp.kind,
        groupKey: sp.groupKey,
        commonName: sp.commonName,
        scientificName: sp.scientificName,
        summary: sp.summary,
        whereFound: sp.whereFound,
        published: true,
        seedManaged: true,
      };
      let id = existing?.id;
      if (decision === "create") {
        const row = await db.biodiversityEntry.create({ data: { slug: sp.slug, ...data } });
        id = row.id;
        created += 1;
      } else if (decision === "update" && existing) {
        await db.biodiversityEntry.update({ where: { id: existing.id }, data });
        updated += 1;
      } else {
        skippedManaged += 1;
      }
      if (id) {
        const existingJoins = await db.biodiversityOnDestination.findMany({
          where: { entryId: id },
        });
        const destIds = sp.destinationSlugs
          .map((s) => destIdBySlug.get(s))
          .filter((x): x is string => Boolean(x));
        const merged = mergeJoinIds(
          existingJoins.map((j) => j.destinationId),
          destIds,
        );
        const existingDestSet = new Set(existingJoins.map((j) => j.destinationId));
        const toAdd = merged.filter((destinationId) => !existingDestSet.has(destinationId));
        if (toAdd.length) {
          await db.biodiversityOnDestination.createMany({
            data: toAdd.map((destinationId) => ({ destinationId, entryId: id })),
            skipDuplicates: true,
          });
        }
      }
    } catch (e) {
      itemErrors += 1;
      console.error("seedSucreNatural species", sp.slug, e);
    }
  }

  for (const exp of SEED_EXPERIENCES) {
    try {
      const existing = await db.natureExperience.findUnique({ where: { slug: exp.slug } });
      const decision = decideSeedMerge(existing);
      const data = {
        title: exp.title,
        tagline: exp.tagline,
        whereText: exp.whereText,
        whatYouDo: exp.whatYouDo,
        specialWhy: exp.specialWhy,
        recommendations: exp.recommendations,
        published: true,
        seedManaged: true,
      };
      let id = existing?.id;
      if (decision === "create") {
        const row = await db.natureExperience.create({ data: { slug: exp.slug, ...data } });
        id = row.id;
        created += 1;
      } else if (decision === "update" && existing) {
        await db.natureExperience.update({ where: { id: existing.id }, data });
        updated += 1;
      } else {
        skippedManaged += 1;
      }
      if (id) {
        const existingJoins = await db.experienceOnDestination.findMany({
          where: { experienceId: id },
        });
        const destIds = exp.destinationSlugs
          .map((s) => destIdBySlug.get(s))
          .filter((x): x is string => Boolean(x));
        const merged = mergeJoinIds(
          existingJoins.map((j) => j.destinationId),
          destIds,
        );
        const existingDestSet = new Set(existingJoins.map((j) => j.destinationId));
        const toAdd = merged.filter((destinationId) => !existingDestSet.has(destinationId));
        if (toAdd.length) {
          await db.experienceOnDestination.createMany({
            data: toAdd.map((destinationId) => ({ destinationId, experienceId: id })),
            skipDuplicates: true,
          });
        }
      }
    } catch (e) {
      itemErrors += 1;
      console.error("seedSucreNatural experience", exp.slug, e);
    }
  }

  console.info(
    `Sucre Natural seed: created=${created} updated=${updated} skippedManaged=${skippedManaged}`,
  );
  if (itemErrors > 0) {
    throw new Error(`Sucre Natural seed terminó con ${itemErrors} errores de ítem.`);
  }
}

async function ensureQueHacerSeedImage(
  db: typeof prisma,
  slug: string,
  assetFile: string,
): Promise<string> {
  const publicUrl = `/uploads/gallery/images/que-hacer-${slug}.webp`;
  const destPath = path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""));
  await mkdir(path.dirname(destPath), { recursive: true });
  const srcPath = path.join(process.cwd(), "src", "assets", assetFile);
  let buffer: Buffer;
  try {
    buffer = await readFile(srcPath);
    buffer = await encodeRasterImageToWebp(buffer, { maxEdge: GALLERY_WEBP_MAX_EDGE });
  } catch {
    buffer = await sharp({
      create: { width: 16, height: 16, channels: 3, background: { r: 20, g: 90, b: 95 } },
    })
      .webp()
      .toBuffer();
  }
  await writeFile(destPath, buffer);
  await db.galleryAsset.upsert({
    where: { publicUrl },
    create: {
      kind: "IMAGE",
      publicUrl,
      mimeType: "image/webp",
      sizeBytes: buffer.length,
      originalName: `que-hacer-${slug}.webp`,
    },
    update: { sizeBytes: buffer.length },
  });
  return publicUrl;
}

export async function seedQueHacer(db: typeof prisma = prisma) {
  let created = 0;
  let updated = 0;
  let skippedManaged = 0;

  for (const item of QUE_HACER_SEED_ITEMS) {
    const photoUrl = await ensureQueHacerSeedImage(db, item.slug, item.assetFile);

    const existingCat = await db.queHacerCategory.findUnique({ where: { slug: item.slug } });
    const catDecision = decideSeedMerge(existingCat);
    let categoryId: string;
    if (catDecision === "create") {
      const cat = await db.queHacerCategory.create({
        data: {
          slug: item.slug,
          name: item.name,
          description: item.description,
          sortOrder: item.sortOrder,
          seedManaged: true,
        },
      });
      categoryId = cat.id;
      created += 1;
    } else if (catDecision === "update") {
      const cat = await db.queHacerCategory.update({
        where: { slug: item.slug },
        data: {
          name: item.name,
          description: item.description,
          sortOrder: item.sortOrder,
        },
      });
      categoryId = cat.id;
      updated += 1;
    } else if (existingCat) {
      categoryId = existingCat.id;
      skippedManaged += 1;
    } else {
      continue;
    }

    const existingAct = await db.queHacerActivity.findUnique({ where: { slug: item.slug } });
    const actDecision = decideSeedMerge(existingAct);
    let activityId: string;
    if (actDecision === "create") {
      const act = await db.queHacerActivity.create({
        data: {
          slug: item.slug,
          title: item.name,
          description: item.description,
          iconKey: item.iconKey,
          published: true,
          sortOrder: item.sortOrder,
          seedManaged: true,
          photos: {
            create: { publicUrl: photoUrl, sortOrder: 0, isCover: true, alt: item.name },
          },
        },
      });
      activityId = act.id;
      created += 1;
    } else if (actDecision === "update") {
      const act = await db.queHacerActivity.update({
        where: { slug: item.slug },
        data: {
          title: item.name,
          description: item.description,
          iconKey: item.iconKey,
          published: true,
          sortOrder: item.sortOrder,
        },
      });
      activityId = act.id;
      const photoCount = await db.queHacerActivityPhoto.count({ where: { activityId } });
      if (photoCount === 0) {
        await db.queHacerActivityPhoto.create({
          data: { activityId, publicUrl: photoUrl, sortOrder: 0, isCover: true, alt: item.name },
        });
      }
      updated += 1;
    } else if (existingAct) {
      activityId = existingAct.id;
      skippedManaged += 1;
    } else {
      continue;
    }

    const existingJoins = await db.queHacerActivityOnCategory.findMany({
      where: { activityId },
    });
    const merged = mergeJoinIds(
      existingJoins.map((j) => j.categoryId),
      [categoryId],
    );
    const have = new Set(existingJoins.map((j) => j.categoryId));
    const toAdd = merged.filter((id) => !have.has(id));
    if (toAdd.length) {
      await db.queHacerActivityOnCategory.createMany({
        data: toAdd.map((id) => ({ activityId, categoryId: id })),
        skipDuplicates: true,
      });
    }
  }

  console.info(
    `Que hacer seed: created=${created} updated=${updated} skippedManaged=${skippedManaged}`,
  );
}

async function main() {
  await seedRoles();
  console.info("Seed OK: roles admin y editor listos.");
  await seedSucreNatural();
  await seedQueHacer();
  console.info("Crea un admin con: npm run admin:create");
}

const isDirect = !process.env.VITEST;
if (isDirect) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
