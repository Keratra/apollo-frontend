'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();
	const [items, setItems] = useState([]);
	const [form, setForm] = useState({
		name: '',
		url: '',
		priceSmall: 0,
		priceMedium: 0,
		priceLarge: 0,
	});

	useEffect(() => {
		if (!loadState('admin')) {
			router.push('/');
		}

		const bearerToken = loadState('admin');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/get-coffees`, {
			method: 'GET',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${bearerToken}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message ?? data.msg) {
					alert(data.message ?? data.msg);
					return;
				}

				setItems(
					Object.keys(data).map((key) => {
						return {
							id: key,
							...data[key],
						};
					})
				);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [router]);

	const handleSubmitCoffee = async (event) => {
		event.preventDefault();

		const bearerToken = loadState('admin');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/add-coffee`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${bearerToken}`,
			},
			body: JSON.stringify({
				name: form.name,
				image_url: form.url,
				tall_price: form.priceSmall,
				grande_price: form.priceMedium,
				venti_price: form.priceLarge,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				if (
					data.message !== 'Coffee added successfully' &&
					data.msg !== 'Coffee added successfully'
				) {
					alert(data.message ?? data.msg);
				}

				// setForm({
				// 	name: '',
				// 	url: '',
				// 	priceSmall: 0,
				// 	priceMedium: 0,
				// 	priceLarge: 0,
				// });

				window.location.href = '/admin';
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleCoffeeDelete = async (id) => {
		const bearerToken = loadState('admin');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/delete-coffee`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${bearerToken}`,
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (
					data.message !== 'Coffee deleted successfully' &&
					data.msg !== 'Coffee deleted successfully'
				) {
					alert(data.message ?? data.msg);
				}

				window.location.href = '/admin';
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className='flex flex-col items-center justify-start p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 self-start text-3xl font-semibold text-gray-800'>
				Here is the list of coffees available in the store right now
			</h1>

			{/* Showing coffees */}
			<section className=''>
				<div className='flex justify-center items-center flex-wrap gap-4 '>
					{items.map((item, index) => (
						<div
							key={index}
							className='flex flex-col items-center justify-start  bg-gray-50 rounded-lg shadow-md'
						>
							<div className=''>
								<Image
									src={
										'https://source.unsplash.com/random/300x300/?coffee&random=' +
										item.image_url
									}
									alt={item.name}
									priority={true}
									width={300}
									height={300}
									className='rounded-tl-md rounded-tr-md'
								/>
							</div>

							<div className='py-4'>
								<div className='flex flex-col items-center justify-start w-full'>
									<div className=' font-serif font-semibold text-xl text-gray-800 '>
										{item.name}
									</div>
								</div>
								<div className='mt-4 grid grid-cols-3 gap-4'>
									<div className='flex flex-col items-center justify-start gap-4 w-full'>
										<div className='text-sm font-medium text-gray-700'>
											Small
										</div>
										<div className=' px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'>
											{'€ ' + item.tall_price}
										</div>
									</div>
									<div className='flex flex-col items-center justify-start gap-4 w-full'>
										<div className='text-sm font-medium text-gray-700'>
											Medium
										</div>
										<div className=' px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'>
											{'€ ' + item.grande_price}
										</div>
									</div>
									<div className='flex flex-col items-center justify-start gap-4 w-full'>
										<div className='text-sm font-medium text-gray-700'>
											Large
										</div>
										<div className=' px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'>
											{'€ ' + item.venti_price}
										</div>
									</div>
								</div>
							</div>
							<div className='w-full flex justify-center items-center p-3 border-t border-gray-300'>
								<div
									onClick={() => handleCoffeeDelete(item.id)}
									className='text-xl text-rose-500 hover:text-rose-300 cursor-pointer transition-colors'
								>
									Delete
								</div>
							</div>
						</div>
					))}
					{items.length === 0 && (
						<div className='flex justify-center items-center gap-2 mt-6 text-xl text-violet-600'>
							<span className='animate-spin'>
								<svg
									style={{ color: 'rgb(129, 53, 243)' }}
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='feather feather-loader'
								>
									<line x1='12' y1='2' x2='12' y2='6'></line>
									<line x1='12' y1='18' x2='12' y2='22'></line>
									<line x1='4.93' y1='4.93' x2='7.76' y2='7.76'></line>
									<line x1='16.24' y1='16.24' x2='19.07' y2='19.07'></line>
									<line x1='2' y1='12' x2='6' y2='12'></line>
									<line x1='18' y1='12' x2='22' y2='12'></line>
									<line x1='4.93' y1='19.07' x2='7.76' y2='16.24'></line>
									<line x1='16.24' y1='7.76' x2='19.07' y2='4.93'></line>
								</svg>
							</span>
							Loading coffees...
						</div>
					)}
				</div>
			</section>

			{/* Adding Coffee Slide-down */}
			<div className='mt-12'>
				<div className='flex justify-center'>
					<button
						className='flex items-center justify-center gap-2 self-center px-4 py-2 mb-4 text-base font-medium text-white bg-violet-400 rounded-lg shadow-md hover:bg-violet-600 transition-colors'
						onClick={() => {
							if (typeof window !== 'undefined') {
								document
									?.getElementById('add-coffee')
									.classList.toggle('sm:hidden');
							}
						}}
					>
						<span>Add Coffee</span>
					</button>
				</div>

				<div
					id='add-coffee'
					className='sm:hidden flex flex-col items-center justify-start gap-4 mb-4 p-4 bg-gray-50 rounded-lg shadow-md'
				>
					<h2 className='text-2xl font-semibold text-gray-800'>
						Add a new coffee here
					</h2>
					<form
						className='flex flex-col items-center justify-start gap-4'
						onSubmit={handleSubmitCoffee}
					>
						<div className='flex flex-col items-start justify-start gap-2 w-full'>
							<label
								htmlFor='name'
								className='text-sm font-medium text-gray-700'
							>
								Name
							</label>
							<input
								type='text'
								name='name'
								id='name'
								className='w-full px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'
								value={form.name}
								onChange={(event) => {
									setForm((prev) => {
										return {
											...prev,
											name: event.target.value,
										};
									});
								}}
								required
							/>
						</div>

						<div className='flex flex-col items-start justify-start gap-2 w-full'>
							<label
								htmlFor='url'
								className='text-sm font-medium text-gray-700'
							>
								Image URL
							</label>
							<input
								type='text'
								name='url'
								id='url'
								className='w-full px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'
								value={form.url}
								onChange={(event) => {
									setForm((prev) => {
										return {
											...prev,
											url: event.target.value,
										};
									});
								}}
								required
							/>
							{form.url && (
								<div className='mb-4'>
									<Image
										src={
											'https://source.unsplash.com/random/300x300/?coffee&random=' +
											form.url
										}
										alt={form.name ?? 'coffee'}
										priority={true}
										width={300}
										height={300}
										className='rounded-tl-md rounded-tr-md'
									/>
								</div>
							)}
						</div>

						<div className='flex flex-col items-start justify-start gap-2 w-full'>
							<label
								htmlFor='priceSmall'
								className='text-sm font-medium text-gray-700'
							>
								Price Small
							</label>
							<input
								type='number'
								name='priceSmall'
								id='priceSmall'
								className='w-full px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'
								value={form.priceSmall}
								onChange={(event) => {
									setForm((prev) => {
										return {
											...prev,
											priceSmall: event.target.value,
										};
									});
								}}
								required
							/>
						</div>
						<div className='flex flex-col items-start justify-start gap-2 w-full'>
							<label
								htmlFor='priceMedium'
								className='text-sm font-medium text-gray-700'
							>
								Price Medium
							</label>
							<input
								type='number'
								name='priceMedium'
								id='priceMedium'
								className='w-full px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'
								value={form.priceMedium}
								onChange={(event) => {
									setForm((prev) => {
										return {
											...prev,
											priceMedium: event.target.value,
										};
									});
								}}
								required
							/>
						</div>
						<div className='flex flex-col items-start justify-start gap-2 w-full'>
							<label
								htmlFor='priceLarge'
								className='text-sm font-medium text-gray-700'
							>
								Price Large
							</label>
							<input
								type='number'
								name='priceLarge'
								id='priceLarge'
								className='w-full px-4 py-2 text-base text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent'
								value={form.priceLarge}
								onChange={(event) => {
									setForm((prev) => {
										return {
											...prev,
											priceLarge: event.target.value,
										};
									});
								}}
								required
							/>
						</div>
						<button
							type='submit'
							className='flex items-center justify-center gap-2 self-center px-4 py-2 text-base font-medium text-white bg-violet-400 rounded-lg shadow-md hover:bg-violet-600 transition-colors'
						>
							<span>Submit</span>
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
