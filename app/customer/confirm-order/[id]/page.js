'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';
import DoneImage from '@/public/done.png';

export default function Page({ params }) {
	const router = useRouter();

	return (
		<div className='flex flex-col items-center justify-start p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 self-start text-3xl font-medium text-gray-800'>
				Thanks for your order!
			</h1>

			{/* Showing cart */}
			<section className='w-full'>
				<div className='w-full my-4 flex justify-center items-center '>
					<Image
						src={DoneImage}
						width={64 * 4}
						height={64 * 4}
						priority={true}
						alt='done'
						className='drop-shadow-md'
					/>
				</div>
				<div className='flex justify-start items-center gap-4 p-4 border-gray-300 border-2 bg-gray-50 rounded-lg shadow-md max-w-xl mx-auto'>
					<span className='font-semibold'>Your order ID:</span> {params.id}
				</div>
			</section>
		</div>
	);
}
