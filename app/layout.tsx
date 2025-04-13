import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TopNavigation from "@/components/top-navigation";
import { AuthProvider } from "@/components/auth-provider";
import ReactQueryProvider from "@/main/ReactQueryContext/ReactQueryContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/main/UserContext/UserContext";

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
      <ReactQueryProvider>
        <UserProvider>
        <body className={`${poppins.className} antialiased`}>
            <ToastContainer />
            <AuthProvider>
              <div className="flex flex-col h-screen">
                <TopNavigation />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
            </AuthProvider>
          </body> 
        </UserProvider>
      </ReactQueryProvider>
    </html>
  );
}


