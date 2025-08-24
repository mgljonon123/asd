const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createCustomAdminUser() {
  try {
    const email = "Specialforcellc@gmail.com";
    const password = "dragonX12";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      console.log("Admin user already exists with this email");
      console.log("User details:", {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
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

createCustomAdminUser();

