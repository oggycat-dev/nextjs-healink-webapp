import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Healink | Không gian chữa lành mỗi ngày",
  description:
    "Healink đồng hành cùng bạn trên hành trình chăm sóc sức khỏe tinh thần qua podcast, cảm hứng hàng ngày và các cơ hội kết nối.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnam.variable} ${inter.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
