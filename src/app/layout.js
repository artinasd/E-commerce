import { Vazirmatn } from 'next/font/google';
import "./globals.css";
import Header from "../components/storefront/Header";
import Footer from "../components/storefront/Footer";

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-vazirmatn',
  preload: true,
});

export const metadata = {
  title: {
    default: "فروشگاه",
    template: "%s | فروشگاه",
  },
  description: "یک تجربه مدرن، سریع و ساده برای خرید آنلاین.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
