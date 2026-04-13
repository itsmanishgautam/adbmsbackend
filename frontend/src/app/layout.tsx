import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export const metadata: Metadata = {
  title: "EHCIDB - Emergency Healthcare Info",
  description: "Secure, reliable access to critical patient metadata during emergencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 min-h-screen" suppressHydrationWarning>
        <Navbar />
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
