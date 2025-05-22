import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tailwind.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const inter = Inter({ subsets: ["latin"] });

const DynamicFooter = dynamic(() => import("../lib/components/Footer"), {
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
        {/* <AntdRegistry>{children}</AntdRegistry> */}
        {children}
        <DynamicFooter />
      </body>
      <GoogleAnalytics gaId="G-CP0EYKVVVR" />
    </html>
  );
}
