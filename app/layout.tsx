import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/presentation/providers/AppProviders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Speech.Ease | Learn English Naturally",
  description: "Improve your English speaking skills with AI assistance",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProviders>
        <body className={`${poppins.className} antialiased`}>
          <ToastContainer />
          {children}
        </body> 
      </AppProviders>
    </html>
  );
}
