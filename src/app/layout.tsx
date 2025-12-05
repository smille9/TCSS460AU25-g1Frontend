import type { Metadata, Viewport } from 'next';

import './globals.css';

// PROJECT IMPORTS
import ProviderWrapper from './ProviderWrapper';
import { roboto } from 'config';

export const metadata: Metadata = {
  title: 'Couchmouse',
  description: 'Movies and TV watchlists'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
