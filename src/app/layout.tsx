import type { Metadata } from "next";
import "@fontsource/geist-sans";
import "@fontsource/geist-mono";
import "@fontsource/inter";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Inner Rise - Sua jornada de transformação",
  description: "Descubra um novo caminho para o bem-estar. No Inner Rise, acreditamos que cada jornada é única.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-inter antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
