import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})


export const metadata: Metadata = {
  title: "Àjọrà — Coming Soon",
  description:
    "A premium, community-driven collective buying platform. Pool demand, earn dividends, and grow together.",
  icons: {
    icon: "./favicon.ico",
    apple: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${montserrat.variable} ${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
