export const metadata = {
  title: "RapidFlashUSDT | Lightning-fast USDT Payment Platform",
  description: "The World's Most Advanced USDT Payment Automation Infrastructure. Lightning-fast, secure, and enterprise-ready USDT payment platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="1cRz7ZXeE81ZqRUFaTPR59oGDOc72rGQA15SUbhnlxA" />
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SBZVBE15M9"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SBZVBE15M9');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
