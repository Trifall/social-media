export const runtime = 'experimental-edge';

export const metadata = {
	title: 'Add New',
	description: 'Contribute to the frameworks list.',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddNewPage() {
	return (
		<>
			<h1>Submit a framework</h1>

			<div className='mb-32 text-center lg:text-left w-[80vw] max-w-2xl flex flex-col'>
				<form action='/api/add-framework' method='post' className='flex flex-col w-full'>
					<div>
						<label htmlFor='framework-name'>Name</label>

						<input type='text' name='name' id='framework-name' placeholder='Framework name' required />
					</div>

					<div>
						<label htmlFor='language'>Language</label>

						<input type='text' name='language' id='language' placeholder='JavaScript' required />
					</div>

					<div>
						<label htmlFor='github-url'>Github</label>

						<input type='text' name='url' id='github-url' placeholder='https://github.com/user/repo' required />
					</div>

					<div>
						<label htmlFor='stars-count'>Stars count</label>

						<input type='number' id='stars-count' name='stars' placeholder='2000' required />
					</div>

					<div className='flex justify-center p-2'>
						<button
							type='submit'
							className='py-2 px-4 text-white font-semibold bg-teal-600 rounded-md hover:bg-teal-700 focus:relative flex space-x-2 justify-between items-center'
							title='View Orders'
						>
							<span>Submit</span>
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
