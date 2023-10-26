import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import Button from '../components/Button';
import CreatePostModal from '../components/CreatePostModal';
import { buildDbClient } from '../utils/dbClient';
import { Post } from './api/post';

type HomeProps = {
	posts: Post[];
};

async function getData() {
	const db = buildDbClient();
	const res = await db.query.posts.findMany({ with: { users: true } });

	console.log(`res: ${JSON.stringify(res, null, 2)}`);

	// console.log(`res: ${JSON.stringify(res, null, 2)}`);
	console.log(`[gssp/getData] Post count received: ${res.length}`);
	return res as unknown as Post[];
}

export default function Home({ posts }: HomeProps) {
	const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

	if (!posts) {
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
			<main className='bg-inherit flex justify-center items-center'>
				<CreatePostModal createPostModalOpen={createPostModalOpen} setCreatePostModalOpen={setCreatePostModalOpen} />
				<div className='mb-32 max-w-[80vw] flex justify-center items-center text-center lg:mb-0 lg:text-left'>
					<div className='max-h-[80vh] relative flex flex-col gap-4 items-center overflow-y-scroll'>
						<Button
							className='w-48  dark:bg-neutral-600 dark:hover:bg-gray-500 hover:bg-neutral-400 dark:text-white bg-neutral-300 text-black px-4 py-3 lg:px-3 lg:py-2 rounded-lg transition-all duration-500 items-center'
							onClick={() => setCreatePostModalOpen(true)}
						>
							Create Post
						</Button>
						{posts.map((post) => (
							<div key={post.id} className='bg-stone-600 flex flex-col rounded-lg bg-inherit p-2'>
								<div className='flex items-center gap-5 px-3 pt-3'>
									<div className='relative h-12 w-12'>
										<Image
											sizes='100%'
											className='rounded-full object-cover m-0'
											fill
											quality={100}
											alt='profile'
											src={post.users?.profileImage ?? ''}
										/>
									</div>
									<h1 className='dark:text-white text-black font-bold text-xl'>{post.users?.name}</h1>
								</div>
								<div className='px-3 pt-3'>{post.content}</div>
								<div className='px-3 pt-3 flex flex-wrap gap-4'>
									{post.media?.map((media) => {
										return (
											<img
												src={media.url}
												key={media.id}
												alt='media'
												className='p-3 border object-contain rounded-lg max-w-sm'
											/>
										);
									})}
								</div>
								<div className='px-3 pt-3'>
									{post.created_at
										? new Date(post.created_at).toLocaleTimeString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
												weekday: 'long',
												hour: '2-digit',
												minute: '2-digit',
												timeZoneName: 'short',
										  })
										: 'N/A'}
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<{ posts: Post[] }> = async () => {
	const data = await getData();
	return {
		props: { posts: data },
	};
};
