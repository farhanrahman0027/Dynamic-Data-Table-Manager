import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReduxProvider from '@/components/ReduxProvider';
import ThemeProviderWrapper from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'A feature-rich data table with import/export, sorting, and inline editing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
