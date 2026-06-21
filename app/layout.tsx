import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import NoiseBackground from '@/components/NoiseBackground';
import InitialLoader from '@/components/ui/InitialLoader';
import Navigation from '@/components/ui/Navigation';
import LeadMagnetModal from '@/components/ui/LeadMagnetModal';

export const metadata: Metadata = {
  title: 'PRIVATE TECHNO — Underground Electronic Culture',
  description: 'PRIVATE TECHNO is an experimental techno record label exploring the boundaries of hypnotic sound, industrial aesthetics, and underground electronic culture.',
  keywords: ['techno', 'electronic music', 'record label', 'underground', 'experimental'],
  openGraph: {
    title: 'PRIVATE TECHNO',
    description: 'Underground Electronic Culture — Hypnotic Sound Exploration',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1336575025252919');
            fbq('track', 'PageView');
          `}
        </Script>
        <Script id="brevo-tracker" strategy="afterInteractive">
          {`
            (function() {
              window.sib = {
                  equeue: [],
                  client_key: "YOUR_BREVO_CLIENT_KEY" // REPLACE THIS WITH YOUR BREVO CLIENT KEY or use process.env.NEXT_PUBLIC_BREVO_CLIENT_KEY
              };
              window.sendinblue = {};
              for (var j = ['track', 'identify', 'trackLink', 'page'], i = 0; i < j.length; i++) {
              (function(k) {
                  window.sendinblue[k] = function() {
                      var arg = Array.prototype.slice.call(arguments);
                      (window.sib[k] || function() {
                              var t = {};
                              t[k] = arg;
                              window.sib.equeue.push(t);
                          })(arg[0], arg[1], arg[2], arg[3]);
                      };
                  })(j[i]);
              }
              var n = document.createElement("script"),
                  i = document.getElementsByTagName("script")[0];
              n.type = "text/javascript", n.id = "sendinblue-js", n.async = !0, n.src = "https://sibautomation.com/sa.js?key=" + window.sib.client_key, i.parentNode.insertBefore(n, i), window.sendinblue.page();
            })();
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1336575025252919&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <InitialLoader />
        <NoiseBackground />
        <div className="grain-overlay" aria-hidden="true" />
        <LeadMagnetModal />
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
