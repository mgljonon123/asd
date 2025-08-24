import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Имэйл болон нууц үг шаардлагатай" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // If user exists but has no password, update it
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: hashedPassword }
        });
        
        return NextResponse.json(
          { message: "Хэрэглэгчийн нууц үг шинэчлэгдлээ" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Хэрэглэгч аль хэдийн байна" },
          { status: 400 }
        );
      }
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { 
        message: "Админ хэрэглэгч амжилттай үүслээ",
        user: { id: newUser.id, email: newUser.email, role: newUser.role }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { message: "Серверийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}

