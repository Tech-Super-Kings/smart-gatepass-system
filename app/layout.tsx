import type { Metadata } from "next";

import "@/app/globals.css";

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
      <body className="bg-[var(--color-bg)] font-sans text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}
