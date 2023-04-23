import { PrismaClient } from "@prisma/client";
import { isProduction } from "~/lib/utils";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (!isProduction) {
  global.prisma = prisma;
}

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("? Database connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export default connectDB;
