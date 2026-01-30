import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CommandPaletteWrapper } from "@/components/CommandPalette/CommandPaletteWrapper";
import { Toaster } from "@/components/Toast/Toaster";
import { MobileNav } from "@/components/Navigation/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Control - Personal Dashboard",
  description: "Command center for all projects, goals, and conversations",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <div className="pb-16 lg:pb-0">
          {children}
        </div>
        <MobileNav />
        <CommandPaletteWrapper />
        <Toaster />
      </body>
    </html>
  );
}
