import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "দোকানদারি — ফেসবুক সেলারদের জন্য গোছানো দোকান",
  description:
    "ফেসবুকে একটা লিংক দিন। কাস্টমার লগইন ছাড়াই অর্ডার করবে। আপনি পাবেন পরিষ্কার ড্যাশবোর্ড, বিকাশ-নগদ-COD।",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "DokanDari", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#b4451a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("DokanDari_theme")?.value;
  const isLight = themeCookie === "light";
  const themeClass = isLight ? "light" : "dark";

  return (
    <html lang={locale} className={`${hind.className} ${themeClass}`} data-theme={themeClass} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('DokanDari_theme') || (document.cookie.match(/(?:^|; )DokanDari_theme=([^;]+)/) || [])[1];
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else if (saved === 'dark') {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RegisterSW />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
