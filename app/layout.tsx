import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomerProvider, MultiProvider } from "@/lib/data/context";

export const metadata = {
  title: "Qik - Programa de Fidelización",
  description: "La plataforma de fidelización más avanzada",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <MultiProvider>{children}</MultiProvider>
      </body>
    </html>
  );
}
