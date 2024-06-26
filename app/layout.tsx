import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          {children}
          <Toaster />
        </ApolloWrapper>
      </body>
    </html>
  );
}
