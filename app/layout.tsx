import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ads Manager - Google Ads 自動管理ダッシュボード',
  description: 'Google Ads の統計データを可視化し、自動ルールで運用を効率化します',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  );
}
