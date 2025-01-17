/** @format */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supplements AI",
  description: "AI bot to recommend supplements and what to buy. Driven by Influencers!"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "min-h-screen h-full w-full dark:text-white dark:bg-[#161616] flex"
        )}
      >
        <Sidebar />
        {/* sidebar */}
        <main className="min-h-screen  w-full p-4">{children}</main>
      </body>
    </html>
  );
}
