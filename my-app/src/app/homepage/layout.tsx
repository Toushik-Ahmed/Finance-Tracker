import SideNavBar from '@/components/shared/SideNavBar';
import { Toaster } from '@/components/ui/toaster';
import { ReduxProvider } from '@/redux/Provider';
import React from 'react';

type Props = {};
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <SideNavBar />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
