const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = "admin@example.com";
    const password = "admin123";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created successfully:", {
      id: user.id,
      email: user.email,
      role: user.role,
    });
    console.log("Login credentials:");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
