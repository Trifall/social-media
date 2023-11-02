import Link from 'next/link';

export default function Custom404() {
	return (
		<section className=''>
			<div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
				<div className='mx-auto max-w-screen-sm text-center'>
					<h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500'>
						404
					</h1>
					<p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
						Something&apos;s missing.
					</p>
					<p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
						Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.{' '}
					</p>
					<Link
						href='/'
						className='inline-flex text-black bg-neutral-300 dark:bg-primary-fg dark:text-white dark:hover:bg-secondary-hover dark:border-light-primary-bg hover:bg-secondary-hover border-secondary-bg border-2 w-36 rounded-lg justify-center items-center transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
					>
						Back to Home
					</Link>
				</div>
			</div>
		</section>
	);
}
