import type { Metadata } from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'TechCrest — Master the Future. One Course at a Time.',
    template: '%s | TechCrest',
  },
  description:
    'TechCrest is a premium tech institute offering in-person training and online courses in cybersecurity, web development, data science, cloud computing, and more.',
  keywords: ['tech courses', 'cybersecurity', 'web development', 'data science', 'online learning', 'Nigeria'],
  authors: [{ name: 'TechCrest' }],
  openGraph: {
    type:        'website',
    locale:      'en_NG',
    url:         process.env.NEXT_PUBLIC_APP_URL,
    siteName:    'TechCrest',
    title:       'TechCrest — Master the Future',
    description: 'Premium tech education in Nigeria. In-person training + online courses.',
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@techcrest',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${plusJakarta.variable}`}>
      <head>
        <script src="https://checkout.flutterwave.com/v3.js" async />
        <script src="https://js.paystack.co/v1/inline.js" async />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'var(--font-plus-jakarta)',
              fontSize: '14px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#00b4d8', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
