import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { decideSeedMerge, mergeJoinIds } from "../src/lib/sucre-natural-seed-merge";
import {
  SEED_DESTINATIONS,
  SEED_EXPERIENCES,
  SEED_HUBS,
  SEED_SOURCES,
  SEED_SPECIES,
} from "./data/sucre-natural-seed";

/**
 * Seed: roles base (admin, editor) + Sucre Natural.
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

  for (const hub of SEED_HUBS) {
    await db.sucreNaturalHub.upsert({
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
    });
  }

  const sourceIdBySlug = new Map<string, string>();
  for (const src of SEED_SOURCES) {
    const row = await db.contentSource.upsert({
      where: { slug: src.slug },
      create: src,
      update: { name: src.name, url: src.url, note: src.note },
    });
    sourceIdBySlug.set(src.slug, row.id);
  }

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

  for (const dest of SEED_DESTINATIONS) {
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
  }

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

async function main() {
  await seedRoles();
  console.info("Seed OK: roles admin y editor listos.");
  await seedSucreNatural();
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
