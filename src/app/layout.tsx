import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La'eeq Allie | Greeff Christie's International Real Estate",
  description: "Discover exceptional properties in Cape Town's City Bowl, Gardens, and Woodstock with La'eeq Allie - Your trusted real estate professional",
  keywords: "Cape Town real estate, property sales, City Bowl properties, Gardens properties, Woodstock properties, Christie's International Real Estate, La'eeq Allie",
  authors: [{ name: "La'eeq Allie" }],
  creator: "La'eeq Allie",
  publisher: "Greeff Christie's International Real Estate",
  metadataBase: new URL('https://allierealty.com'),
  openGraph: {
    title: "La'eeq Allie | Greeff Christie's International Real Estate",
    description: "Discover exceptional properties in Cape Town's City Bowl, Gardens, and Woodstock with La'eeq Allie - Your trusted real estate professional",
    url: 'https://allierealty.com',
    siteName: "La'eeq Allie Properties",
    locale: 'en_ZA',
    type: 'website',
    images: [
      {
        url: '/A-16.jpg',
        width: 1200,
        height: 630,
        alt: "La'eeq Allie - Real Estate Professional",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "La'eeq Allie | Greeff Christie's International Real Estate",
    description: "Discover exceptional properties in Cape Town's City Bowl, Gardens, and Woodstock with La'eeq Allie",
    images: ['/A-16.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
