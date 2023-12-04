'use client';

import Image from 'next/image';
import Link from 'next/link';
import ApolloImage from '/public/apollo.png';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Layout({ children }) {
	const state = loadState('admin') || loadState('customer');

	return (
		<main className='flex min-h-[90vh] flex-col'>
			<div className='mt-4 flex grow flex-col gap-4 md:flex-row'>
				<div className='flex flex-col justify-start gap-6 rounded-lg bg-gray-50 p-4 md:w-2/12'>
					<div className='flex justify-center select-none'>
						<Image
							src={ApolloImage}
							alt='Apollo'
							priority={true}
							width={50 * 2}
							height={74 * 2}
							className='drop-shadow-md select-none hue-rotate-180'
						/>
					</div>
					<Link
						href='/admin'
						className='select-none flex items-center gap-5 self-stretch rounded-lg bg-violet-400 hover:bg-violet-600 px-6 py-3 text-base font-medium text-white shadow-md transition-colors'
					>
						<span>Coffees</span>
					</Link>
					<Link
						href='/admin/history'
						className='select-none flex items-center gap-5 self-stretch rounded-lg bg-violet-400 hover:bg-violet-600 px-6 py-3 text-base font-medium text-white shadow-md transition-colors'
					>
						<span>Orders</span>
					</Link>
					<div className='grow'></div>
					{true ? (
						<Link
							href='/auth/logout'
							className={`text-center text-xl text-rose-600 hover:text-rose-300 transition-colors mb-2 font-bold`}
						>
							LOGOUT
						</Link>
					) : (
						''
					)}
				</div>
				{children}
			</div>
		</main>
	);
}
