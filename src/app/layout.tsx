import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Toast from "@/components/marketplace/common/toast";

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
  display: "swap",
});

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
  const isProduction =
    process.env.NEXT_PUBLIC_APP_ENV === "production" ||
    process.env.NODE_ENV === "production";

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isProduction = ${isProduction};
                if (isProduction) {
                  const noop = () => {};
                  window.console.log = noop;
                  window.console.error = noop;
                  window.console.warn = noop;
                  window.console.info = noop;
                  window.console.debug = noop;
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${playfair.variable} ${inter.variable} antialiased`}>
        <Toast />
        {children}
      </body>
    </html>
  );
}

