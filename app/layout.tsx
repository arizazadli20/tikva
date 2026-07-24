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
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Leaflet CSS via CDN — avoids Turbopack PostCSS processing panic */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
