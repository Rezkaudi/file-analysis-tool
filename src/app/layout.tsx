import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// third parties
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'

// styles
import "@/styles/globals.css";

// fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// sections
import Header from "@/components/common/sections/Header";
import Footer from "@/components/common/sections/Footer";

// baseUrl
import { baseUrl } from '@/utils/baseUrl';

// metadata
export const metadata: Metadata = {

  title: {
    default: "File Analysis Tool",
    template: "%s | File Analysis Tool",
  },

  description: "File Analysis Tool Description",

  applicationName: "File Analysis Tool",

  generator: "Next.js",

  keywords: ["File Analysis Tool"],

  referrer: "origin",

  creator: "File Analysis Tool",

  publisher: "File Analysis Tool",

  alternates: {
    canonical: baseUrl
  },

  openGraph: {
    type: "website",
    url: baseUrl,
    title: "File Analysis Tool",
    description: "File Analysis Tool Description",
    siteName: "File Analysis Tool",
    images: [
      { url: "/images/file-analysis.png" }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "File Analysis Tool",
    description: "File Analysis Tool Description",
    images: "/images/file-analysis.png"
  },

  verification: {
    google: "id",
  },

  category: "Business",

  classification: "Business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-id" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-id" />
    </html>
  );
}
