import Image from 'next/image';
import ApolloImage from '/public/apollo.png';

export default function Page() {
	return (
		<main className='flex min-h-[90vh] flex-col'>
			<div className='mt-4 flex grow flex-col gap-4 md:flex-row'>
				<div className='flex flex-col items-center justify-start gap-4 p-4 md:w-full md:px-28 md:py-4  rounded-lg'>
					<div className='flex justify-center select-none my-12'>
						<Image
							src={ApolloImage}
							alt='Apollo'
							width={50 * 5}
							height={74 * 5}
							className='drop-shadow-md select-none hue-rotate-180'
						/>
					</div>
					<h1 className='text-3xl font-semibold text-gray-800 max-w-6xl'>
						Welcome to Apollo, where exceptional coffee meets effortless
						convenience!
					</h1>
					<p className='text-lg font-medium text-gray-800 max-w-5xl text-justify'>
						Indulge your senses in a world of unparalleled coffee crafted from
						the finest, ethically sourced ingredients. We are excited to
						introduce our new online ordering system, designed to elevate your
						coffee experience. Say goodbye to phone orders and embrace the
						simplicity of placing your favorite brews at your fingertips.
					</p>
					<p className='text-lg font-medium text-gray-800 max-w-5xl text-justify'>
						Explore our meticulously curated menu, showcasing a diverse
						selection of handcrafted blends, single-origin delights, and
						specialty beverages that cater to every coffee connoisseur&apos;s
						palate. Whether you crave the bold richness of an espresso or the
						velvety smoothness of a latte, Apollo promises a journey through
						taste like no other.
					</p>
				</div>
			</div>
		</main>
	);
}
