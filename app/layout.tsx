import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GPACalc — GPA Calculator for Students',
  description:
    'Convert SGPA, CGPA, or percentage to GPA on 10 or 4-point scales instantly. Upload marksheets for automatic OCR extraction. Free, private, browser-based.',
  keywords: ['GPA calculator', 'SGPA to GPA', 'percentage to GPA', 'CGPA converter', 'GPA out of 10', 'GPA out of 4'],
  openGraph: {
    title: 'GPACalc — GPA Calculator for Students',
    description: 'Instantly convert SGPA, CGPA, or percentage to GPA. Free & private.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
