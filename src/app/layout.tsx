import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Assistant Perso",
  description: "Ton assistant personnel pour t'organiser",
  applicationName: "Assistant Perso",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Assistant",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} dark antialiased`}>
      <body className="flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <main className="flex flex-1 flex-col overflow-y-auto overscroll-y-contain">
          {children}
        </main>
        <Nav />
      </body>
    </html>
  );
}
