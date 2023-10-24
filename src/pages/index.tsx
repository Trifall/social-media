import { Dialog } from '@headlessui/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { MultiUploader } from '../components/UploadButton';
import { buildDbClient } from '../utils/dbClient';
import { Framework } from './api/add-framework';

type HomeProps = {
	frameworks: Framework[];
};

async function getData() {
	const db = buildDbClient();
	const res = await db.query.frameworks.findMany();
	console.log(`res: ${JSON.stringify(res, null, 2)}`);
	return res as unknown as Framework[];

	// const mockData: Framework[] = [
	// 	{
	// 		id: 1,
	// 		name: 'React',
	// 		language: 'JavaScript',
	// 		url: 'https://github.com/facebook/react',
	// 		stars: 170000,
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Vue',
	// 		language: 'JavaScript',
	// 		url: 'https://github.com/vuejs/vue',
	// 		stars: 180000,
	// 	},
	// 	{
	// 		id: 3,
	// 		name: 'Angular',
	// 		language: 'TypeScript',
	// 		url: 'https://github.com/angular/angular',
	// 		stars: 70000,
	// 	},
	// ];
	// return mockData;
}

export default function Home({ frameworks }: HomeProps) {
	const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

	if (!frameworks) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Head>
				<title>Social Media</title>
				<meta name='description' content='Social Media App' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='bg-inherit'>
				<CreatePostModal createPostModalOpen={createPostModalOpen} setCreatePostModalOpen={setCreatePostModalOpen} />
				<div className='mb-32 flex flex-col text-center lg:mb-0 lg:text-left'>
					<Button className='w-48 border-2' onClick={() => setCreatePostModalOpen(true)}>
						Create Post
					</Button>
					<div className='mt-20 overflow-x-auto rounded-lg border border-gray-200 w-[80vw] max-w-2xl'>
						<table className='w-full divide-y-2 divide-gray-200 text-sm'>
							<thead>
								<tr>
									<th>Name</th>
									<th>Language</th>
									<th>GitHub Stars</th>
									<th>Repo</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{frameworks.map((framework: Framework) => (
									<tr key={framework.id}>
										<td>{framework.name}</td>
										<td>{framework.language}</td>
										<td className='stars'>{framework.stars}</td>
										<td className='whitespace-nowrap text-center px-4 py-2'>
											<a
												href={framework.url}
												target='_blank'
												className='group rounded-lg border border-transparent px-2 py-1 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 '
											>
												Visit 🔗
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<{ frameworks: Framework[] }> = async () => {
	const data = await getData();
	return {
		props: { frameworks: data },
	};
};

const CreatePostModal = ({
	createPostModalOpen,
	setCreatePostModalOpen,
}: {
	createPostModalOpen: boolean;
	setCreatePostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const handleSubmit = async () => {
		// handle creation
	};

	return (
		<Modal isOpen={createPostModalOpen} closeModal={() => setCreatePostModalOpen(false)}>
			<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all'>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-full'>
						<AiOutlinePlusSquare className='h-6 w-6 text-teal-300' />
					</div>
					<Dialog.Title as='h3' className='text-lg font-medium leading-6 text-white'>
						Create Post
					</Dialog.Title>
				</div>
				<div className='mt-2'>
					<p className='text-sm text-gray-200'>Fill out information for your post.</p>
				</div>
				{/* <div className='w-full border-t border-gray-400 my-4' /> */}
				<div className='mt-4'>
					<MultiUploader />
				</div>

				<div className='mt-4 flex flex-col gap-4'>
					<Button
						className='flex items-center shadow-sm justify-center gap-2 border-white border hover:text-white hover:bg-gray-800 transition-all duration-300'
						onClick={() => handleSubmit()}
					>
						Submit
					</Button>
				</div>
			</Dialog.Panel>
		</Modal>
	);
};
