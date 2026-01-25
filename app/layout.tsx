import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_components/navbar/Navbar";

export const metadata: Metadata = {
  title: "master-app",
  description: "prashant's personal app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
