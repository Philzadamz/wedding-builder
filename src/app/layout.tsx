import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velvet — Beautiful Wedding Websites",
  description: "Create a beautiful, personalised wedding website in under 30 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
