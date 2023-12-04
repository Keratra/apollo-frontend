import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Apollo',
	description: 'Finest Coffe In The World',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${inter.className} flex min-h-screen flex-col p-4`}>
				<div className='flex shrink-0 items-end rounded-lg bg-violet-500 p-4 gap-x-12 '>
					<Link
						href='/'
						className={`text-xl text-white hover:text-neutral-300 transition-colors font-semibold`}
					>
						APOLLO
					</Link>
					<Link
						href='/auth/admin/login'
						className={`text-xl text-white hover:text-neutral-300 transition-colors `}
					>
						Administrator
					</Link>
					<Link
						href='/auth/customer/login'
						className={`text-xl text-white hover:text-neutral-300 transition-colors `}
					>
						Distinguished Customer
					</Link>
				</div>
				{children}
			</body>
		</html>
	);
}
