const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function fixAdminUser() {
  try {
    console.log("Checking database connection...");
    
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully");
    
    // Check if there are any existing users
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} existing users`);
    
    if (allUsers.length > 0) {
      allUsers.forEach(user => {
        console.log(`User: ${user.email}, Role: ${user.role}, Has Password: ${!!user.password}`);
      });
    }
    
    // Check for the specific admin user
    const email = "Specialforcellc@gmail.com";
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existingUser) {
      console.log("Found existing user:", existingUser);
      
      // If user exists but has no password, update it
      if (!existingUser.password) {
        console.log("User exists but has no password. Updating...");
        const hashedPassword = await bcrypt.hash("dragonX12", 10);
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword }
        });
        
        console.log("Password updated successfully");
      } else {
        console.log("User already exists with password");
      }
    } else {
      console.log("Creating new admin user...");
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash("dragonX12", 10);
      
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      
      console.log("Admin user created successfully:", {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
    }
    
    console.log("\nLogin credentials:");
    console.log("Email:", email);
    console.log("Password: dragonX12");
    
  } catch (error) {
    console.error("Error:", error);
    
    if (error.code === 'P2032') {
      console.log("\nThis error suggests there's a database schema issue.");
      console.log("Try running: npx prisma db push --force-reset");
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminUser();

