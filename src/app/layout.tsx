import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'DOMAS · Catatan Keuangan',
  description: 'Catat pemasukan dan pengeluaran, lalu tinjau transaksi tersimpan.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
