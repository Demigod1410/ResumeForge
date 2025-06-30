import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'ResumeForge',
  description: 'Enhance your resume with AI-powered suggestions.',
  metadataBase: new URL('https://resumeforge.ai'),
  openGraph: {
    title: 'ResumeForge - AI Resume Enhancement',
    description: 'Craft the perfect resume with AI-powered suggestions',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#121212" />
      </head>
      <body className="font-body antialiased">
        <div className="relative flex min-h-dvh flex-col bg-background">
          <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-5"></div>
          <Header />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
