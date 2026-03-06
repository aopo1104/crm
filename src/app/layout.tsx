import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM 系统",
  description: "B2B SaaS CRM 产品原型",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Sidebar />
        <main className="ml-56 min-h-screen bg-gray-50/50">
          {children}
        </main>
      </body>
    </html>
  );
}
