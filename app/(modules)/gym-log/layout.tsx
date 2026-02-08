import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-gym-log',
  display: 'swap',
});

export default function GymLogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={montserrat.className}>
      {children}
    </div>
  );
}

