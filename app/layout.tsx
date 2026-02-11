import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/context/query-provider";
import { SocketProvider } from "@/context/SocketContext";
import { ConnectionStatus } from "@/components/connection-status";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProFootball - Live Match Center",
  description: "Real-time football match updates and statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <SocketProvider>
            <ConnectionStatus />
            {children}
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
