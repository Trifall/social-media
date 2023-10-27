import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Button from '../components/Button';
import CreatePostModal from '../components/CreatePostModal';
import PostCard from '../components/PostCard';
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
			<main className='flex items-center justify-center bg-inherit'>
				<CreatePostModal createPostModalOpen={createPostModalOpen} setCreatePostModalOpen={setCreatePostModalOpen} />
				<div className='mb-32 flex max-w-[80vw] items-center justify-center lg:mb-0 lg:text-left'>
					<div className='relative flex max-h-[80vh] flex-col items-center gap-4 overflow-y-scroll no-scrollbar'>
						<Button
							className='w-48  items-center rounded-lg bg-neutral-300 px-4 py-3 text-black transition-all duration-500 hover:bg-neutral-400 dark:bg-neutral-600 dark:text-white dark:hover:bg-gray-500 lg:px-3 lg:py-2'
							onClick={() => setCreatePostModalOpen(true)}
						>
							Create Post
						</Button>
						{posts.map((post) => {
							return <PostCard post={post} key={post.id} />;
						})}
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
