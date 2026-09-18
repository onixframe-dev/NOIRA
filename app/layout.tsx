import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const display = Cormorant_Garamond({ subsets: ['latin', 'cyrillic'], variable: '--font-display', weight: ['500', '600', '700'] });
const sans = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://noira-brown.vercel.app'),
  alternates: { canonical: '/' },
  title: 'NOIRA — премиальный корм для кошек',
  description: 'Концепт премиального бренда NOIRA: современное питание для кошек, интерактивная подача продукта и подбор формулы.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'NOIRA — премиальный корм для кошек',
    description: 'Современное питание для кошек. Чистый состав. Красивые ежедневные ритуалы.',
    images: ['/assets/lifestyle.webp']
  }
};

export const viewport: Viewport = { themeColor: '#090908', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
