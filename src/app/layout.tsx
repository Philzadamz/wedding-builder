import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedding-builder-sage.vercel.app";

export const metadata: Metadata = {
  title: "Velvet — Beautiful Wedding Websites",
  description: "Create a beautiful, personalised wedding website in under 30 minutes.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Velvet Weddings",
    title: "Velvet — Beautiful Wedding Websites",
    description: "Create a beautiful, personalised wedding website in under 30 minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velvet — Beautiful Wedding Websites",
    description: "Create a beautiful, personalised wedding website in under 30 minutes.",
  },
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
