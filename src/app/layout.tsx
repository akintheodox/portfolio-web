import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CursorCanvas from "@/components/CursorCanvas";
import Navigation from "@/components/Navigation";
import { client } from "@/sanity/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Theophilus Akinlabi — Portfolio",
  description: "Senior Brand Designer & Creative Director",
};

// Fetch all gallery images. Coalesce ensures it finds the image whether the field is named 'image' or 'coverImage'
const GALLERY_QUERY = `*[_type == "galleryItem" && (defined(image) || defined(coverImage))] {
  "url": coalesce(image.asset->url, coverImage.asset->url)
}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch images on the server
  const galleryDocs = await client.fetch(GALLERY_QUERY);
  const galleryImages = galleryDocs.map((doc: any) => doc.url).filter(Boolean);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white selection:bg-white selection:text-black`}
      >
        <CursorCanvas />
        {/* Pass the Sanity images directly into the Navigation component */}
        <Navigation galleryImages={galleryImages} />
        {children}
      </body>
    </html>
  );
}