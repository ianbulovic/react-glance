import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const weatherIcons = localFont({
  src: "./weathericons-regular-webfont.woff2",
  display: "swap",
  variable: "--font-weather-icons",
});

export const metadata: Metadata = {
  title: "Homepage",
  description: "Personal homepage",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-mono ${weatherIcons.variable}`}>{children}</body>
    </html>
  );
}
