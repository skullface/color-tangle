import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Color Tangle",
  description: "Match color names to swatches as fast as you can.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
