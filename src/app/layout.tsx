import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PAKSHYA — Legal Metrology Inspection Portal | Department of Consumer Affairs, Government of India',
  description: 'AI-Assisted Legal Metrology Inspection System for Packaged Commodities Rules, 2011 (PCR 2011) — Smart India Hackathon Prototype (SIH26034)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#f1f5f9] text-slate-900">
        {children}
      </body>
    </html>
  );
}
