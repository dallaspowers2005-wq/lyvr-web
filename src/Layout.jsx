import React from 'react';
import MobileNav from '@/components/home/MobileNav';

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-sand: #e8dfd5;
          --color-clay: #c4a77d;
          --color-sunset: #e07b39;
          --color-oasis-blue: #5b9aa0;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
        }
        
        ::selection {
          background-color: #fde68a;
          color: #78350f;
        }

        /* Ensure minimum tap target size on mobile */
        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Prevent horizontal scroll on mobile */
        body {
          overflow-x: hidden;
        }
      `}</style>
      <MobileNav />
      {children}
    </div>
  );
}