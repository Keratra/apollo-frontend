'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();
	const [items, setItems] = useState([]);
	const [cart, setCart] = useState([]);

	useEffect(() => {
		if (loadState('cart')) {
			setCart(loadState('cart'));
		}
	}, []);

	useEffect(() => {
		if (!loadState('customer')) {
			router.push('/');
		}

		const bearerToken = loadState('customer');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/customer/get-coffees`, {
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

	const handleCartAdd = (id) => {
		const item = items.find((item) => item.id === id);
		const cartItem = cart.find((item) => item.id === id);

		let quantity = 1;
		let size = 'tall';
		let sizePrice = item.tall_price;

		const userInput = prompt('Enter the quantity:');
		if (userInput) {
			try {
				quantity = parseInt(userInput);
			} catch (error) {
				console.log(error);
				alert('Invalid quantity');
				return;
			}
		} else {
			alert('Invalid quantity');
			return;
		}

		const userInputSize = prompt('Enter the size (small, medium, large):');

		if (!userInputSize) {
			alert('Invalid size');
			return;
		}

		if (userInputSize.toLowerCase() === 'small' || userInputSize === '1') {
			size = 'tall';
			sizePrice = item.tall_price;
		}

		if (userInputSize.toLowerCase() === 'medium' || userInputSize === '2') {
			size = 'grande';
			sizePrice = item.grande_price;
		}

		if (userInputSize.toLowerCase() === 'large' || userInputSize === '3') {
			size = 'venti';
			sizePrice = item.venti_price;
		}

		setCart([
			...cart,
			{ id, name: item.name, size: size, price: sizePrice, quantity },
		]);

		saveState('cart', cart);
	};

	return (
		<div className='flex flex-col items-center justify-start p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 self-start text-3xl font-semibold text-gray-800'>
				Here is the list of coffees available in the store right now
			</h1>

			<div className='mb-8'>
				<Link href='/customer/cart'>
					<span className='text-xl border-2 border-indigo-500 hover:border-indigo-300 rounded-lg p-2 bg-transparent text-indigo-500 hover:text-indigo-300 cursor-pointer transition-colors'>
						View Cart (€
						{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)})
					</span>
				</Link>
			</div>

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
									onClick={() => handleCartAdd(item.id)}
									className='text-xl text-indigo-500 hover:text-indigo-300 cursor-pointer transition-colors'
								>
									ADD TO CART
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
		</div>
	);
}
