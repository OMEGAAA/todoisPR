import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "広報業務管理 - PR Manager",
  description: "広報業務を一元管理し、情報収集・企画・制作・承認・投稿・効果測定までを効率化するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
