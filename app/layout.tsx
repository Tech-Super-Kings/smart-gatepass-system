import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/app/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Smart GatePass",
  description: "Fast, secure, and contactless visitor entry management for apartments, malls, and IT parks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} bg-[var(--color-bg)] font-sans text-slate-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
