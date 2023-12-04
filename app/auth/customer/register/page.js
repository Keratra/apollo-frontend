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
		name: '',
		surname: '',
		phone_number: '',
		address: '',
		password: '',
		passwordConfirm: '',
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!form.email || !form.password) {
			alert('Please enter both email and password');
			return;
		}

		if (form.password !== form.passwordConfirm) {
			alert('Password and password confirmation do not match');
			return;
		}

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/customer/register`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(form),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message === 'User added successfully') {
					alert(
						"Registration successful. You'll be redirected to login page soon..."
					);
					router.push('/auth/customer/login');
				}

				if (data.message !== 'User added successfully') {
					alert(data.message);
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
				Register
			</h1>
			<section className='mt-12 flex flex-col justify-start'>
				<div className='grid grid-cols-2  mb-6 bg-white rounded-md shadow-md'>
					<Link href='/auth/customer/login'>
						<div className='p-4 text-center font-semibold cursor-pointer rounded-tl-md rounded-bl-md bg-white hover:bg-indigo-200 transition-colors'>
							SIGN IN
						</div>
					</Link>
					<Link href='/auth/customer/register'>
						<div className='p-4 text-center font-semibold cursor-pointer rounded-tr-md rounded-br-md bg-indigo-100 hover:bg-indigo-200 transition-colors'>
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
						required
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								email: event.target.value,
							});
						}}
					/>
					<div className='flex gap-4'>
						<div className='flex flex-col'>
							<label htmlFor='name' className='text-gray-800'>
								Name
							</label>
							<input
								type='text'
								id='name'
								required
								className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								onChange={(event) => {
									setForm({
										...form,
										name: event.target.value,
									});
								}}
							/>
						</div>
						<div className='flex flex-col'>
							<label htmlFor='surname' className='text-gray-800'>
								Surname
							</label>
							<input
								type='text'
								id='surname'
								required
								className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
								onChange={(event) => {
									setForm({
										...form,
										surname: event.target.value,
									});
								}}
							/>
						</div>
					</div>

					<label htmlFor='phone_number' className='text-gray-800'>
						Phone Number
					</label>
					<input
						type='text'
						id='phone_number'
						required
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								phone_number: event.target.value,
							});
						}}
					/>
					<label htmlFor='address' className='text-gray-800'>
						Address
					</label>
					<input
						type='text'
						id='address'
						required
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								address: event.target.value,
							});
						}}
					/>

					<label htmlFor='password' className='text-gray-800'>
						Password
					</label>
					<input
						type='password'
						id='password'
						required
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								password: event.target.value,
							});
						}}
					/>
					<label htmlFor='passwordConfirm' className='text-gray-800'>
						Password Confirmation
					</label>
					<input
						type='password'
						id='passwordConfirm'
						required
						className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={(event) => {
							setForm({
								...form,
								passwordConfirm: event.target.value,
							});
						}}
					/>

					<button
						type='submit'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-800 transition-colors'
					>
						Sign up
					</button>
				</form>
			</section>
		</div>
	);
}
