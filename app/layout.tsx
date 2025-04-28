import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const DynamicFooter = dynamic(() => import("./components/feedback/Footer"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Qik feedback",
  description: "Qik feedback",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale will be detected client-side by i18next-browser-languagedetector
  // const locale = "es"; // Removed hardcoded locale

  return (
    // Set initial lang to fallback 'en'. Client might update this later if needed.
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/qik.svg" />
      <body className={inter.className}>
        {/* Removed locale prop, provider will use detected language */}
        {children}
        <DynamicFooter />
      </body>
      <GoogleAnalytics gaId="G-CP0EYKVVVR" />
    </html>
  );
}
