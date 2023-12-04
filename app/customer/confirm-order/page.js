'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadState, saveState, deleteState } from '@/app/lib/utils';

export default function Page() {
	const router = useRouter();
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

	const handleFinalizeOrder = async (event) => {
		event.preventDefault();

		if (cart?.length === 0) {
			alert('Cart is empty');
			return;
		}

		const bearerToken = loadState('customer');

		fetch(`${process.env.NEXT_PUBLIC_BACKEND}/customer/make-order`, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${bearerToken}`,
			},
			body: JSON.stringify({
				coffees: cart,
				deliver_time: deliverTime,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (
					data.message !== 'Order added successfully' &&
					data.msg !== 'Order added successfully'
				) {
					alert(data.message ?? data.msg);
				}

				saveState('cart', []);

				router.push('/customer/confirm-order/' + data.order_id);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div className='flex flex-col items-center justify-start p-4 md:w-full md:px-28 md:py-4 rounded-lg'>
			<h1 className='mt-4 mb-8 self-start text-3xl font-medium text-gray-800'>
				Are you sure you want to confirm this order?
			</h1>

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
								'w-full flex items-center justify-center py-2 ' +
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
				<div className='w-full px-4 py-2 mb-4 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent'>
					{deliverTime}
				</div>

				<span
					onClick={handleFinalizeOrder}
					className='cursor-pointer flex items-center justify-center gap-2 self-center px-4 py-2 mb-4 text-base font-medium text-white bg-violet-600 rounded-lg shadow-md hover:bg-violet-800 transition-colors'
				>
					Finalize Order: (€
					{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)})
				</span>
			</div>
		</div>
	);
}
