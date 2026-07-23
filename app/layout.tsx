import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIKVA — Early Detection & Circular Recovery of Port Oil Spills",
  description:
    "TIKVA uses Sentinel-1 SAR satellite imagery and AI to detect port oil spills in real time, then converts recovered sorbent into usable products via pyrolysis.",
  keywords: [
    "oil spill detection",
    "satellite AI",
    "Sentinel-1",
    "circular recovery",
    "port monitoring",
    "pyrolysis",
    "bio-sorbent",
  ],
  openGraph: {
    title: "TIKVA Mission Control Dashboard",
    description:
      "Real-time port oil spill detection and circular recovery tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
