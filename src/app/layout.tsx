import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zaiqa Express",
  description: "Generated Muhammad Yousaf Haseen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Providers>
        <Navbar  />
        <main className="py-20 px-4 md:px-12 flex flex-col items-center justify-center min-h-screen">
        {children}
        </main>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
