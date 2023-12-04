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
	const [deliverTime, setDeliverTime] = useState('');
	const [customer, setCustomer] = useState({
		name: '',
		surname: '',
		id: '',
		email: '',
		phone_number: '',
		address: '',
	});

	useEffect(() => {
		if (loadState('cart')) {
			setCart(loadState('cart'));
		}

		if (loadState('deliverTime')) {
			setDeliverTime(loadState('deliverTime'));
		}
	}, []);

	useEffect(() => {
		const bearerToken = loadState('customer');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/customer/get-user`, {
			method: 'GET',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${bearerToken}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (data.message || data.msg) {
					alert(data.message ?? data.msg);
				}

				setCustomer(data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleConfirmOrder = async (event) => {
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

				window.location.href = '/admin';
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// const handleCartAdd = (id) => {
	// 	const item = items.find((item) => item.id === id);
	// 	const cartItem = cart.find((item) => item.id === id);

	// 	let quantity = 1;
	// 	let size = 'tall';
	// 	let sizePrice = item.tall_price;

	// 	const userInput = prompt('Enter the quantity:');
	// 	if (userInput) {
	// 		try {
	// 			quantity = parseInt(userInput);
	// 		} catch (error) {
	// 			console.log(error);
	// 			alert('Invalid quantity');
	// 			return;
	// 		}
	// 	} else {
	// 		return;
	// 	}

	// 	const userInputSize = prompt('Enter the size (small, medium, large):');

	// 	if (!userInputSize) {
	// 		return;
	// 	}

	// 	if (userInputSize.toLowerCase() === 'small' || userInputSize === '1') {
	// 		size = 'tall';
	// 		sizePrice = item.tall_price;
	// 	}

	// 	if (userInputSize.toLowerCase() === 'medium' || userInputSize === '2') {
	// 		size = 'grande';
	// 		sizePrice = item.grande_price;
	// 	}

	// 	if (userInputSize.toLowerCase() === 'large' || userInputSize === '3') {
	// 		size = 'venti';
	// 		sizePrice = item.venti_price;
	// 	}

	// 	if (cartItem) {
	// 		cartItem.quantity += quantity;
	// 		setCart([...cart]);
	// 	} else {
	// 		setCart([
	// 			...cart,
	// 			{ name: item.name, size: size, price: sizePrice, quantity },
	// 		]);
	// 	}

	// 	saveState('cart', cart);
	// };

	const handleIncrement = (index) => {
		const cartItem = cart[index];
		cartItem.quantity += 1;
		setCart([...cart]);
		saveState('cart', cart);
	};

	const handleDecrement = (index) => {
		const cartItem = cart[index];
		cartItem.quantity -= 1;
		setCart([...cart]);
		saveState('cart', cart);
	};

	const handleRemove = (index) => {
		const confirmation = confirm('Are you sure you want to delete this item?');

		if (confirmation) {
			cart.splice(index, 1);
			setCart([...cart]);
			saveState('cart', cart);
		}
	};

	return (
		<div className='flex flex-col items-center justify-start p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 self-start text-3xl font-medium text-gray-800'>
				Here is your cart where you can see the coffees you have added and
				finalize your order
			</h1>

			<div
				onClick={() => {
					saveState('cart', []);
					setCart([]);
				}}
				className='flex justify-center items-center gap-2 my-2 text-xl text-rose-600 mb-4 cursor-pointer'
			>
				<span className='text-xl border-2 border-rose-500 hover:border-rose-300 rounded-lg p-2 bg-transparent text-rose-500 hover:text-rose-300 cursor-pointer transition-colors'>
					Delete Cart
				</span>
			</div>

			<div>
				<div className='grid grid-cols-1 gap-4 p-4 border-gray-300 border-2 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto mb-4'>
					<div className='flex justify-start items-center gap-4 w-full'>
						<div className='text-base font-medium text-gray-700'>
							<span className='font-bold'>Name: </span>
							{customer.name} {customer.surname}
						</div>
					</div>
					<div className='flex justify-start items-center gap-4 w-full'>
						<div className='text-base font-medium text-gray-700'>
							<span className='font-bold'>Email: </span>
							{customer.email}
						</div>
					</div>
					<div className='flex justify-start items-center gap-4 w-full'>
						<div className='text-base font-medium text-gray-700'>
							<span className='font-bold'>Phone Number: </span>
							{customer.phone_number}
						</div>
					</div>
					<div className='flex justify-start items-center gap-4 w-full'>
						<div className='text-base font-medium text-gray-700'>
							<span className='font-bold'>Address: </span>
							{customer.address}
						</div>
					</div>
				</div>
			</div>

			{/* Showing cart */}
			<section className='w-full'>
				<div className='grid grid-cols-1 gap-4 p-4 border-gray-300 border-2 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto'>
					{cart.map(({ name, size, price, quantity }, index) => (
						<div
							key={index}
							className={
								'w-full flex items-center justify-center ' +
								(index !== cart.length - 1 ? 'border-b-2 pb-4' : '')
							}
						>
							<div className='flex justify-center items-center gap-4 w-full'>
								<div className='text-base font-semibold text-gray-700'>
									{name}
								</div>
							</div>
							<div className='flex justify-center items-center gap-4 w-full'>
								<div className='text-base font-semibold text-gray-700'>
									Size: {size}
								</div>
							</div>
							<div className='flex justify-center items-center gap-4 w-full'>
								<div className='text-base font-semibold text-gray-700'>
									Price: €{price}
								</div>
							</div>
							<div className='flex justify-center items-center gap-4 w-full'>
								<div className='text-base font-semibold text-gray-700'>
									Quantity: {quantity}
								</div>
							</div>
							<div className='flex justify-center items-center gap-4 w-full'>
								<div className='text-base font-semibold text-gray-700'>
									Total: €{price * quantity}
								</div>
							</div>
							{/* Actions */}
							<div className='flex justify-center items-center gap-x-12 w-full'>
								<div className='flex justify-center items-center gap-4'>
									<button
										className='text-4xl font-bold text-emerald-700'
										onClick={() => handleIncrement(index)}
									>
										+
									</button>
									{quantity === 1 ? (
										<button
											className='text-4xl font-bold text-rose-700 mt-2'
											onClick={() => handleRemove(index)}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												width='24'
												height='24'
												fill='currentColor'
												className='bi bi-trash'
												viewBox='0 0 16 16'
											>
												<path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' />
												<path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' />
											</svg>
										</button>
									) : (
										<button
											className='text-4xl font-bold text-rose-700'
											onClick={() => handleDecrement(index)}
										>
											-
										</button>
									)}
								</div>
							</div>
						</div>
					))}
					{cart.length === 0 && (
						<div className='flex justify-center items-center gap-2 my-2 text-xl text-violet-600'>
							<span className='animate-spin mr-2'>|</span>
							No items were found...
						</div>
					)}
				</div>
			</section>

			<div className='my-8 grid grid-cols-3 gap-4 w-full max-w-4xl'>
				<label
					htmlFor='deliverTime'
					className='place-self-end self-center mb-4 block text-xl font-medium text-gray-700'
				>
					Deliver Time:
				</label>
				<select
					value={deliverTime}
					onChange={(event) => {
						setDeliverTime(event.target.value);
						saveState('deliverTime', event.target.value);
					}}
					className='w-full px-4 py-2 mb-4 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent'
				>
					<option value='Now'>Now</option>
					<option value='In 35 minutes'>In 35 minutes</option>
					<option value='Tomorrow'>Tomorrow</option>
				</select>

				<Link href='/customer/confirm-order'>
					<span className='flex items-center justify-center gap-2 self-center px-4 py-2 mb-4 text-base font-medium text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-800 transition-colors'>
						Confirm Order: (€
						{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)})
					</span>
				</Link>
			</div>
		</div>
	);
}
