import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RevAgent | AI Revenue Recovery Engine",
  description: "Autonomous, guardrailed revenue recovery for payment failures and checkout drop-offs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Instant Tailwind CSS via Script CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}