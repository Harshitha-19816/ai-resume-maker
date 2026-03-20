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
  title: "AI Tools Hub — The Ultimate Career Workspace",
  description:
    "AI-powered professional suite: Resume building, YouTube summarization, automated job search, and smart notes tracking.",
  keywords: [
    "AI tools",
    "resume builder",
    "YouTube summarizer",
    "job search",
    "notes saver",
    "career productivity",
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
