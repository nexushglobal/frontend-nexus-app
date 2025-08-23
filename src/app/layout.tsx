import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-h-global.com'),
  title: {
    default: "NEXUS H GLOBAL - Tu Camino hacia la Libertad Financiera",
    template: "%s | NEXUS H GLOBAL"
  },
  description: "Invierte en bienes raíces, desarrolla tu educación financiera y construye tu negocio inmobiliario con NEXUS H GLOBAL. Más de 10 años de experiencia, +4,000 lotes vendidos y S/ 300M+ en activos.",
  keywords: [
    "bienes raíces",
    "inversión inmobiliaria", 
    "libertad financiera",
    "educación financiera",
    "marketing multinivel",
    "MLM",
    "network marketing",
    "negocio inmobiliario",
    "lotes de inversión",
    "Nexus Academy",
    "emprendimiento",
    "comisiones inmobiliarias",
    "El Olivar",
    "Apolo",
    "Oasis",
    "Flamant",
    "Huertas Inmobiliaria",
    "Inverti Fast",
    "Perú",
    "Lima"
  ],
  authors: [{ name: "NEXUS H GLOBAL", url: "https://nexus-h-global.com" }],
  creator: "NEXUS H GLOBAL",
  publisher: "NEXUS H GLOBAL",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://nexus-h-global.com',
    siteName: 'NEXUS H GLOBAL',
    title: 'NEXUS H GLOBAL - Tu Camino hacia la Libertad Financiera',
    description: 'Invierte en bienes raíces, desarrolla tu educación financiera y construye tu negocio inmobiliario. Más de 10 años de experiencia respaldando tu camino hacia la libertad financiera.',
    images: [
      {
        url: '/imgs/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NEXUS H GLOBAL - Libertad Financiera a través de Bienes Raíces',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS H GLOBAL - Tu Camino hacia la Libertad Financiera',
    description: 'Invierte en bienes raíces, desarrolla tu educación financiera y construye tu negocio inmobiliario con más de 10 años de experiencia.',
    images: ['/imgs/twitter-card.jpg'],
    creator: '@nexushglobal',
    site: '@nexushglobal',
  },
  alternates: {
    canonical: 'https://nexus-h-global.com',
    languages: {
      'es-PE': 'https://nexus-h-global.com',
      'es': 'https://nexus-h-global.com',
    },
  },
  category: 'Real Estate Investment',
  classification: 'Business',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: [
    {
      rel: "icon",
      url: "/imgs/isotipo_negro.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon", 
      url: "/imgs/isotipo_blanco.ico",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/imgs/apple-touch-icon.png",
    },
  ],
  manifest: "/manifest.json",
  other: {
    'msapplication-TileColor': '#1f2937',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#1f2937',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                position="top-right"
                richColors
                duration={5000}
                closeButton
                toastOptions={{
                  className: "bg-popover text-popover-foreground",
                  style: {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                  } as React.CSSProperties,
                }}

              />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
