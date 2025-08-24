const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function fixNullPassword() {
  try {
    console.log("🔧 Fixing null password issue...");
    
    // Connect to database
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    // Find users with null passwords
    console.log("\n🔍 Finding users with null passwords...");
    
    // We need to use raw MongoDB query since Prisma can't handle null passwords
    const usersWithNullPassword = await prisma.$runCommandRaw({
      find: "users",
      filter: { password: null }
    });
    
    console.log(`Found ${usersWithNullPassword.cursor.firstBatch.length} users with null passwords`);
    
    if (usersWithNullPassword.cursor.firstBatch.length > 0) {
      usersWithNullPassword.cursor.firstBatch.forEach(user => {
        console.log(`\nUser with null password:`);
        console.log(`  ID: ${user._id}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Role: ${user.role}`);
      });
      
      // Fix each user with null password
      for (const user of usersWithNullPassword.cursor.firstBatch) {
        console.log(`\n🔧 Fixing user: ${user.email}`);
        
        // Generate new password hash
        const newPassword = "dragonX12";
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user with new password
        await prisma.$runCommandRaw({
          update: "users",
          updates: [{
            q: { _id: user._id },
            u: { $set: { password: hashedPassword } }
          }]
        });
        
        console.log(`✅ Fixed password for user: ${user.email}`);
      }
    }
    
    // Now try to find the specific admin user
    console.log("\n🔍 Checking for admin user...");
    const email = "Specialforcellc@gmail.com";
    
    try {
      const adminUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      
      if (adminUser) {
        console.log("✅ Admin user found and accessible:");
        console.log(`  ID: ${adminUser.id}`);
        console.log(`  Email: ${adminUser.email}`);
        console.log(`  Role: ${adminUser.role}`);
        console.log(`  Has Password: ${!!adminUser.password}`);
      } else {
        console.log("❌ Admin user not found, creating new one...");
        
        const hashedPassword = await bcrypt.hash("dragonX12", 10);
        const newAdmin = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "ADMIN",
          },
        });
        
        console.log("✅ New admin user created:", newAdmin.email);
      }
    } catch (error) {
      console.log("❌ Still can't access user data, creating fresh admin user...");
      
      // Try to create a completely new user
      const hashedPassword = await bcrypt.hash("dragonX12", 10);
      
      try {
        await prisma.$runCommandRaw({
          insert: "users",
          documents: [{
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "ADMIN",
            createdAt: new Date(),
            updatedAt: new Date()
          }]
        });
        
        console.log("✅ New admin user created using raw MongoDB command");
      } catch (insertError) {
        console.error("❌ Failed to create user:", insertError);
      }
    }
    
    console.log("\n🎉 Password fix completed!");
    console.log("Login credentials:");
    console.log("Email:", email);
    console.log("Password: dragonX12");
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixNullPassword();

