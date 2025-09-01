import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Poppins, Staatliches } from 'next/font/google';

const fontBody = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
});

const fontHeadline = Staatliches({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'CareerQuest: Gamified Path to Your Future',
  description: 'Discover your future, one game at a time. CareerQuest offers gamified skill assessments to help you find the perfect career path.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased flex flex-col", fontBody.variable, fontHeadline.variable)}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
