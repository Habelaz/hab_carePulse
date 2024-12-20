import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils"
import {Poppins,Plus_Jakarta_Sans} from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider";
const Font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['300','400','500','600','700'],
  variable: "--font-sans"
})
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CarePulse",
  description: "appointment scheduling app for health centors",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const themeClass = "light"; // Default theme to light for SSR
  return (
    <html lang="en" className={themeClass}>
      <body className={cn("min-h-screen bg-dark-300 font-sans antialiased", Font.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

