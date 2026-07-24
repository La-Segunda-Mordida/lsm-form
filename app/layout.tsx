import type { Metadata } from "next";
import { Anton, Kanit } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const kanit = Kanit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "La Segunda Mordida — Registro",
  description: "Formulario de registro de miembros LSM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${kanit.variable} ${anton.variable} font-[family-name:var(--font-kanit)] min-h-full`}>
        {children}
      </body>
    </html>
  );
}
