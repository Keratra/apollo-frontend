'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();
	const [items, setItems] = useState([]);

	useEffect(() => {
		if (!loadState('customer')) {
			router.push('/');
		}

		const bearerToken = loadState('customer');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/customer/get-orders`, {
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

				setItems(data.user_orders);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [router]);

	return (
		<div className='flex flex-col items-center justify-start p-4 md:w-full xl:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 self-start text-3xl font-semibold text-gray-800'>
				Here is the list of coffees available in the store right now
			</h1>

			{/* Showing coffees */}
			<section className=''>
				<div className='grid grid-cols-1 gap-4 max-w-4xl '>
					{items
						.map(
							(
								{
									id,
									user_id,
									user_name,
									user_surname,
									user_address,
									user_phone_number,
									deliver_time,
									date,
									coffees,
								},
								index
							) => (
								<div
									key={index}
									className='px-6 flex flex-col items-center justify-start  bg-gray-50 rounded-lg shadow-md'
								>
									<div className='py-4'>
										<div className='grid grid-cols-3 gap-x-12 w-full place-content-center'>
											<div className='col-span-3 font-serif font-semibold text-xl text-gray-800  place-self-center self-center mb-2'>
												Order ID: <span className='font-medium'>{id}</span>
											</div>
										</div>
										<div className='flex justify-center items-center gap-x-12 w-full'>
											<div className='text-base font-medium text-gray-700'>
												Delivery Time: {deliver_time}
											</div>
										</div>
										<div className='flex justify-center items-center gap-x-12 w-full mt-2'>
											<div className='text-base font-medium text-gray-700'>
												Total:{' €'}
												{coffees.reduce(
													(a, b) => a + b.price * b.quantity,
													0
												)}{' '}
											</div>
										</div>
										<div className='w-full mt-4 flex flex-wrap justify-center items-center gap-4 gap-x-12 border-t-2 p-2 '>
											{coffees.map(
												({ id, name, price, quantity, size }, index) => (
													<div
														key={index}
														className='flex flex-col items-center justify-center'
													>
														<div className='text-base font-semibold text-gray-700'>
															{name}
														</div>
														<div className='text-sm font-medium text-gray-700'></div>
														<div className='text-sm font-medium text-gray-700 uppercase'>
															{size} &times;{quantity}
														</div>
													</div>
												)
											)}
										</div>
									</div>
								</div>
							)
						)
						.reverse()}
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
							Loading orders...
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
