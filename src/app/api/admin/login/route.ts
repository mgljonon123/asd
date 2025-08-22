import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Имэйл болон нууц үг шаардлагатай" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Имэйл эсвэл нууц үг буруу байна" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Имэйл эсвэл нууц үг буруу байна" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Админ эрх байхгүй байна" },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return NextResponse.json(
      {
        message: "Амжилттай нэвтэрлээ",
        user: { id: user.id, email: user.email, role: user.role },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Серверийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}
