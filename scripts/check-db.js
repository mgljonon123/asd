const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("Checking database connection...");
    
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    // Check if there are any existing users
    console.log("\n🔍 Checking existing users...");
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} existing users`);
    
    if (allUsers.length > 0) {
      allUsers.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`  ID: ${user.id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Has Password: ${!!user.password}`);
        console.log(`  Password Length: ${user.password ? user.password.length : 0}`);
        console.log(`  Created: ${user.createdAt}`);
        console.log(`  Updated: ${user.updatedAt}`);
      });
    }
    
    // Check for the specific admin user
    console.log("\n🔍 Checking for specific admin user...");
    const email = "Specialforcellc@gmail.com";
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existingUser) {
      console.log("✅ Found existing user:");
      console.log(`  ID: ${existingUser.id}`);
      console.log(`  Email: ${existingUser.email}`);
      console.log(`  Role: ${existingUser.role}`);
      console.log(`  Has Password: ${!!existingUser.password}`);
      console.log(`  Password Length: ${existingUser.password ? existingUser.password.length : 0}`);
    } else {
      console.log("❌ User not found");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
    
    if (error.code === 'P2032') {
      console.log("\n🔧 This error suggests there's a database schema issue.");
      console.log("The password field might be null or corrupted.");
    }
    
    if (error.code === 'P1001') {
      console.log("\n🔧 Database connection issue.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

