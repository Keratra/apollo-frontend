'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!form.email || !form.password) {
			alert('Please enter both email and password');
			return;
		}

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/customer/login`, {
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
					saveState('customer', data.access_token);
					router.push('/customer');
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
			<h1 className='mt-4 mb-8 text-center text-5xl font-semibold text-gray-800'>
				Distinguished Customer
				<br />
				Login
			</h1>
			<section className='mt-12 flex flex-col justify-start'>
				<div className='grid grid-cols-2  mb-6 bg-white rounded-md shadow-md'>
					<Link href='/auth/customer/login'>
						<div className='p-4 text-center font-semibold cursor-pointer rounded-tl-md rounded-bl-md bg-indigo-100 hover:bg-indigo-200 transition-colors'>
							SIGN IN
						</div>
					</Link>
					<Link href='/auth/customer/register'>
						<div className='p-4 text-center font-semibold cursor-pointer rounded-tr-md rounded-br-md bg-white hover:bg-indigo-200 transition-colors'>
							SIGN UP
						</div>
					</Link>
				</div>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<label htmlFor='email' className='text-gray-800'>
						Email
					</label>
					<input
						type='email'
						id='email'
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								email: event.target.value,
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
						Sign in
					</button>
				</form>
			</section>
		</div>
	);
}
