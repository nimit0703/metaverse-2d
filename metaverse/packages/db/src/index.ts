import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

(async () => {
  try {
    await client.$connect();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
})();

export default client;
