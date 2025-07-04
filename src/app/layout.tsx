import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TranslationProvider from '../providers/TranslationProvider'
import { Toaster } from 'sonner';

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
import AuthProvider from "./AuthProvider";

// metadata
export const metadata: Metadata = {

  title: {
    default: "Resumate",
    template: "%s | Resumate",
  },

  description: "Resumate Description",

  applicationName: "Resumate",

  generator: "Next.js",

  keywords: ["Resumate"],

  referrer: "origin",

  creator: "Resumate",

  publisher: "Resumate",

  alternates: {
    canonical: baseUrl
  },

  openGraph: {
    type: "website",
    url: baseUrl,
    title: "Resumate",
    description: "Resumate Description",
    siteName: "Resumate",
    images: [
      { url: `${baseUrl}/images/file-analysis.png` }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Resumate",
    description: "Resumate Description",
    images: `${baseUrl}/images/file-analysis.png`
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
    <TranslationProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </TranslationProvider>
    </html>
  );
}
