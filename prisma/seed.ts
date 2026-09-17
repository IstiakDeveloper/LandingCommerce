import { PrismaClient } from "../generated/prisma";
import { hashPin } from "../lib/hash";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database for a completely fresh state...");

  // Delete all existing store data in relational order
  await prisma.orderItem.deleteMany({});
  await prisma.ledgerEntry.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.landingPage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.shopPayment.deleteMany({});
  await prisma.messageTemplate.deleteMany({});
  await prisma.blockedPhone.deleteMany({});
  await prisma.shop.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared previous orders, products, and shops.");

  // Initialize Platform Settings
  await prisma.platformSettings.upsert({
    where: { id: "default" },
    update: {
      feePerOrderPoisha: 500,
      duePausePoisha: 50000,
      platformBkash: "01700000000",
      platformNagad: "01700000000",
    },
    create: {
      id: "default",
      feePerOrderPoisha: 500,
      duePausePoisha: 50000,
      platformBkash: "01700000000",
      platformNagad: "01700000000",
    },
  });

  // Seed single Owner account (No Shop)
  const pinHash = await hashPin("1234");
  const owner = await prisma.user.create({
    data: {
      phone: "01700000000",
      pinHash,
      locale: "bn",
      fontScale: "normal",
      role: "owner",
      failedPinCount: 0,
    },
    include: { shop: true },
  });

  console.log("Fresh Owner account created successfully:");
  console.log(`Phone: ${owner.phone} | PIN: 1234 | Has Shop: ${Boolean(owner.shop)}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
