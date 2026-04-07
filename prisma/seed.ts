import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Solo asegura roles base (admin, editor). Para crear el primer usuario admin:
 *   npm run admin:create
 */
async function main() {
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

  console.info("Seed OK: roles admin y editor listos.");
  console.info("Crea un admin con: npm run admin:create");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
