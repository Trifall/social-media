import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
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

async function getPosts() {
	const db = buildDbClient();
	const postsResponse = await db.query.posts.findMany({
		with: {
			users: {
				columns: {
					id: true,
					name: true,
					profileImage: true,
				},
			},
			comments: true,
		},
	});

	// console.log(`Posts Response: ${JSON.stringify(postsResponse, null, 2)}`);

	// console.log(`res: ${JSON.stringify(res, null, 2)}`);
	console.log(`[gSSP/getPosts/getData] Post count received: ${postsResponse.length}`);
	return postsResponse as unknown as Post[];
}

export default function Home({ posts }: HomeProps) {
	const [createPostModalOpen, setCreatePostModalOpen] = useState(false);

	const session = useSession();
	const user = session?.data?.user;

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
				<div className='flex max-w-[80vw] items-center justify-center lg:mb-0 lg:text-left'>
					<div className='relative flex flex-col items-center gap-4 overflow-y-scroll no-scrollbar'>
						<Button
							className='w-48  items-center rounded-lg bg-neutral-300 px-4 py-3 text-black transition-all duration-500 hover:bg-neutral-400 dark:bg-neutral-600 dark:text-white dark:hover:bg-gray-500 lg:px-3 lg:py-2'
							onClick={() => setCreatePostModalOpen(true)}
						>
							Create Post
						</Button>
						{posts.map((post) => {
							return <PostCard post={post} key={post.id} user={user} />;
						})}
					</div>
				</div>
			</main>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<{ posts: Post[] }> = async () => {
	const postData = await getPosts();
	// const session = await getServerSession(context.req, context.res, authOptions);

	return {
		props: { posts: postData },
	};
};
