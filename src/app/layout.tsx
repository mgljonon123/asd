import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Securox - Орчноо дээдээс доош хүртэл хамгаал",
  description: "Эрсдэлийг бууруулж, бүтээгдэхүүнээ хурдан хүргэж, асуудлыг урьдчилан шийдэхийн тулд securex-ээр дэд бүтцээ сайжруулаарай.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
