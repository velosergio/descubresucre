import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";
import { SUCRE_NATURAL_HUBS } from "@/lib/sucre-natural-hubs";

function getDbUrl() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL no está definida.");
  return url;
}

export function createTestPrisma() {
  const adapter = new PrismaMariaDb(getDbUrl());
  return new PrismaClient({ adapter });
}

export async function resetTestDatabase(prisma: PrismaClient) {
  await prisma.destinationSource.deleteMany();
  await prisma.biodiversityOnDestination.deleteMany();
  await prisma.experienceOnDestination.deleteMany();
  await prisma.imperdibleGalleryItem.deleteMany();
  await prisma.imperdibleDestinationHub.deleteMany();
  await prisma.imperdibleDestination.deleteMany();
  await prisma.biodiversityEntry.deleteMany();
  await prisma.natureExperience.deleteMany();
  await prisma.contentSource.deleteMany();
  await prisma.sucreNaturalHub.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.chatJob.deleteMany();
  await prisma.chatbotSettings.deleteMany();
}

export async function seedBaseRoles(prisma: PrismaClient) {
  const admin = await prisma.role.upsert({
    where: { name: "admin" },
    create: { name: "admin" },
    update: {},
  });
  const editor = await prisma.role.upsert({
    where: { name: "editor" },
    create: { name: "editor" },
    update: {},
  });
  return { admin, editor };
}

export async function seedSucreNaturalHubs(prisma: PrismaClient) {
  await prisma.sucreNaturalHub.createMany({
    data: SUCRE_NATURAL_HUBS.map((hub) => ({
      id: hub.id,
      title: hub.title,
      tagline: hub.tagline,
      sortOrder: hub.sortOrder,
    })),
    skipDuplicates: true,
  });
}
