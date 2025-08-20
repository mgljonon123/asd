import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpecialForceLLC - Орчноо дээдээс доош хүртэл хамгаал",
  description: "SpecialForceLLC–ийн шийдлээр орчноо хамгаалж, эрсдэлийг бууруулж, гэмт хэргээс урьдчилан сэргийлээрэй.",
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
