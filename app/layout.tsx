import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KICKNOW26 - FIFA World Cup 2026 Live Streaming",
  description:
    "Watch FIFA World Cup 2026 matches live. Stream IPTV sports channels, view upcoming matches, live scores, and match results.",
  keywords: [
    "FIFA World Cup 2026",
    "World Cup streaming",
    "live football",
    "IPTV sports",
    "World Cup 2026 matches",
  ],
  openGraph: {
    title: "KICKNOW26 - FIFA World Cup 2026 Live Streaming",
    description: "Watch FIFA World Cup 2026 matches live for free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
