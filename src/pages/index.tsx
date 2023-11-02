import type { Post } from '@/types/types';
import Button from '@components/Button';
import CreatePostModal from '@components/CreatePostModal';
import PostCard from '@components/PostCard';
import { db } from '@utils/dbClient';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';

type HomeProps = {
	posts: Post[];
};

async function getPosts() {
	const postsResponse = await db.query.posts.findMany({
		orderBy: (posts, { desc }) => [desc(posts.created_at)],
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
				<div className='flex w-full items-center justify-center lg:mb-0 lg:text-left'>
					<div className='relative flex flex-col items-center overflow-y-scroll no-scrollbar'>
						<Button
							className='w-48 items-center rounded-lg dark:hover:bg-secondary-hover dark:bg-secondary-bg  hover:bg-secondary-hover dark:text-white bg-light-primary-fg border-2 border-secondary-bg text-black px-4 py-3 mb-4 transition-all duration-500 lg:px-3 lg:py-2'
							onClick={() => setCreatePostModalOpen(true)}
						>
							Create Post
						</Button>
						<div className='w-full h-[1px] bg-black dark:bg-white'></div>
						{posts.map((post) => {
							return (
								<div key={post.id} className='flex w-screen justify-center items-center flex-col'>
									<PostCard post={post} user={user} />
									<div className='w-full h-[1px] bg-black dark:bg-white'></div>
								</div>
							);
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
