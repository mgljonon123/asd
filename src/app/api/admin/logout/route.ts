import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();

    // Clear the admin token cookie
    cookieStore.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    return NextResponse.json({ message: "Амжилттай гарлаа" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Серверийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}
