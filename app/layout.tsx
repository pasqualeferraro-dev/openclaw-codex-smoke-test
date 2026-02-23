import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pasquale Ferraro — Portfolio",
  description: "Personal portfolio homepage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
