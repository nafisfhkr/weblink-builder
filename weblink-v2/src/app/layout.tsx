import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import { DM_Sans, Barlow } from 'next/font/google';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { CONFIG } from 'src/global-config';
import { QueryProvider } from 'src/lib/query';
import { LocalizationProvider } from 'src/locales';
import { themeOverrides } from 'src/theme/theme-overrides';
import { themeConfig, ThemeProvider, primary as primaryColor } from 'src/theme';

import { Preconnect } from 'src/components/preconnect';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';

// ----------------------------------------------------------------------

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-barlow',
});

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  // Child pages export a short title only — this template appends the brand.
  // Pages needing a fully custom title use `title: { absolute: '...' }`.
  title: {
    default: CONFIG.appName,
    template: `%s - ${CONFIG.appName}`,
  },
  description:
    'Venturo adalah software house di Malang dengan 130+ talenta dedicated team untuk pengembangan software, outsourcing programmer, dan konsultasi IT.',
  openGraph: {
    type: 'website',
    siteName: CONFIG.appName,
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
    {
      rel: 'apple-touch-icon',
      url: `${CONFIG.assetsDir}/apple-touch-icon.png`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" className={`${dmSans.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          modeStorageKey={themeConfig.modeStorageKey}
          defaultMode={themeConfig.defaultMode}
        />

        <Preconnect />

        <QueryProvider>
          <LocalizationProvider>
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeProvider
                themeOverrides={themeOverrides}
                modeStorageKey={themeConfig.modeStorageKey}
                defaultMode={themeConfig.defaultMode}
              >
                <MotionLazy>
                  <ProgressBar />
                  {children}
                </MotionLazy>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </LocalizationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
