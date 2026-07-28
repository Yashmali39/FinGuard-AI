import { PrismaClient, Role, Department } from "@prisma/client";
import bcrypt from "bcrypt";
import env from "../src/config/env.js";

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
  where: {
    email: env.DEFAULT_ADMIN_EMAIL,
  },
});

  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
  env.DEFAULT_ADMIN_PASSWORD,
  10
);

  // Create default admin
  await prisma.user.create({
    data: {
  userId: "EMP0001",
  name: "System Administrator",
  email: env.DEFAULT_ADMIN_EMAIL,
  password: hashedPassword,
  role: Role.ADMIN,
  department: Department.FRAUD_INVESTIGATION,
  isActive: true,
},
  });

  console.log("Default Admin Created Successfully!");
}

main()
  .catch((error) => {
    console.error("Error while seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });