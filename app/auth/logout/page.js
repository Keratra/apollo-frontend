'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();

	useEffect(() => {
		deleteState('customer');
		deleteState('admin');

		setTimeout(() => {
			router.push('/');
		}, 1000);
	}, []);

	return (
		<div className='flex flex-col items-center justify-center p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mb-8 text-3xl font-semibold text-gray-800 mt-12'>
				You&apos;re now logged out...
			</h1>
		</div>
	);
}
