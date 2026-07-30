import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import Chatbot from '@/components/Chatbot';
import PwaUpdater from '@/components/PwaUpdater';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sunil Kunchoor Basavaraju - Senior MLOps Engineer',
  description: 'Senior MLOps Engineer bridging Data Science innovation with Production reliability.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-body antialiased selection:bg-primary/20 bg-background text-foreground animate-reveal">
        {children}
        <Chatbot />
        <PwaUpdater />
      </body>
    </html>
  );
}
