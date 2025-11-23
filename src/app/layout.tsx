import './globals.scss';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import CustomCursor from '@/app/components/CustomCursor/CustomCursor';

// Футуристичный шрифт
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Artem Zaitsev | Frontend Developer',
  description: 'Portfolio of Artem Zaitsev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}