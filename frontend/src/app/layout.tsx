import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css'; // Go up ONE level from app to src, then styles

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Staff Dashboard',
  description: 'Staff dashboard for canteen management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}