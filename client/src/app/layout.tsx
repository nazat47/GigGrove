import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers.js";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelance",
  description: "Freelancing Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StateProvider initialState={initialState} reducer={reducer}>
          <div className="relative flex flex-col justify-between h-screen">
            <Navbar />
            <div className="mb-auto w-full mx-auto">{children}</div>
            <Footer />
          </div>
        </StateProvider>
      </body>
    </html>
  );
}
