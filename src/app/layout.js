import "./globals.css";

export const metadata = {
  title: {
    default: "فروشگاه",
    template: "%s | فروشگاه",
  },
  description: "یک تجربه مدرن، سریع و ساده برای خرید آنلاین.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
