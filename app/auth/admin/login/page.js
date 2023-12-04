'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();
	const [form, setForm] = useState({
		username: '',
		password: '',
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/login`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(form),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.access_token) {
					saveState('admin', data.access_token);
					router.push('/admin');
				}

				if (data.message ?? data.msg) {
					alert(data.message ?? data.msg);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className='flex flex-col items-center justify-center p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 text-5xl font-semibold text-gray-800'>
				Admin Login
			</h1>
			<section className='min-h-[60vh] flex flex-col justify-center'>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<label htmlFor='username' className='text-gray-800'>
						Username
					</label>
					<input
						type='text'
						id='username'
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								username: event.target.value,
							});
						}}
					/>
					<label htmlFor='password' className='text-gray-800'>
						Password
					</label>
					<input
						type='password'
						id='password'
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								password: event.target.value,
							});
						}}
					/>
					<button
						type='submit'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 transition-colors'
					>
						Login
					</button>
				</form>
			</section>
		</div>
	);
}
