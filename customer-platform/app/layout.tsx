import type { Metadata } from 'next';
import { Heebo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-heebo',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'GSM | אפליקציית לקוחות',
  description: 'GSM Customer Platform — autonomous fueling, EV charging, and in-car convenience store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} ${jetbrains.variable}`}>{children}</body>
    </html>
  );
}
