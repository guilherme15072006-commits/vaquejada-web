import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-serif', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });

const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const metadata: Metadata = {
  title: 'Áurea — seu dinheiro vira ouro', description: 'Protótipo navegável da Áurea (dados fictícios).',
  manifest: `${bp}/manifest.webmanifest`, appleWebApp: { capable: true, title: 'Áurea', statusBarStyle: 'black-translucent' },
  icons: { icon: `${bp}/icon.svg` },
};
export const viewport: Viewport = { themeColor: '#07070A', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
