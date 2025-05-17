import type { Metadata } from 'next';
import { RainbowKitProviders } from './providers/RainbowKit';
import { ToastProvider } from './providers/ToastProvider';
import BottomNavigation from './components/BottomNavigation';
import Header from './components/Header';
import './globals.css';
import './styles/fonts.css';

export const metadata: Metadata = {
  title: 'TOKEN Liquidity Incentive Program',
  description: 'Stake TOKEN/ETH liquidity tokens, earn $TOKEN rewards',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen bg-[#121212] text-foreground antialiased">
        <RainbowKitProviders>
          <ToastProvider>
            <Header />
            {children}
            <BottomNavigation />
          </ToastProvider>
        </RainbowKitProviders>
      </body>
    </html>
  );
} 