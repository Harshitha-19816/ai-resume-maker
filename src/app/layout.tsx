import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Resume Studio — Build Resumes That Land Interviews",
  description:
    "Create stunning, ATS-optimized resumes with AI-powered content generation, beautiful templates, and one-click PDF export.",
  keywords: [
    "resume builder",
    "AI resume",
    "career",
    "professional resume",
    "PDF export",
    "ATS optimized",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <div className="noise-overlay" />
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            className: "glass",
          }}
        />
      </body>
    </html>
  );
}
