// app/layout.tsx
import "../styles/index.scss";
import Providers from "@/components/Providers"; // Client Component mới
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const isDev = process.env.NODE_ENV === 'production';

  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <head>
        <meta name="keywords" content="Real estate, Property sale, Property buy" />
        <meta name="description" content="Hostel Finder là nền tảng tìm trọ và quản lý trọ trực tuyến." />
        <meta property="og:site_name" content="Homy" />
        <meta property="og:url" content="https://creativegigstf.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hostel Finder" />
        <meta name='og:image' content='images/assets/ogg.png' />
        {/* Các thẻ meta khác */}
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" />
      </head>
      <body suppressHydrationWarning={true}>
        <div className="main-page-wrapper">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
