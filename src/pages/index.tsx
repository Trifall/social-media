import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import Button from '../components/Button';
import CreatePostModal from '../components/CreatePostModal';
import NoSSR from '../components/NoSSR';
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
				<div className='mb-32 flex max-w-[80vw] items-center justify-center text-center lg:mb-0 lg:text-left'>
					<div className='relative flex max-h-[80vh] flex-col items-center gap-4 overflow-y-scroll'>
						<Button
							className='w-48  items-center rounded-lg bg-neutral-300 px-4 py-3 text-black transition-all duration-500 hover:bg-neutral-400 dark:bg-neutral-600 dark:text-white dark:hover:bg-gray-500 lg:px-3 lg:py-2'
							onClick={() => setCreatePostModalOpen(true)}
						>
							Create Post
						</Button>
						{posts.map((post) => {
							const dateString = post.created_at
								? new Date(post.created_at).toLocaleTimeString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										weekday: 'long',
										hour: '2-digit',
										minute: '2-digit',
										timeZoneName: 'short',
								  })
								: 'N/A';

							return (
								<div
									key={post.id}
									className='flex flex-col rounded-lg bg-inherit bg-neutral-200 p-2 dark:bg-neutral-800'
								>
									<div className='flex items-center gap-5 px-3 pt-3'>
										<div className='relative h-12 w-12'>
											<Image
												sizes='100%'
												className='m-0 rounded-full object-cover'
												fill
												quality={100}
												alt='profile'
												src={post.users?.profileImage ?? ''}
											/>
										</div>
										<h1 className='text-xl font-bold text-black dark:text-white'>{post.users?.name}</h1>
									</div>
									<div className='px-3 pt-3'>{post.content}</div>
									<div className='flex flex-wrap justify-evenly gap-4 px-3 pt-3'>
										{post.media?.map((media) => {
											return (
												<img
													src={media.url}
													key={media.id}
													alt='media'
													className='max-w-sm flex-auto rounded-lg border border-neutral-400 object-contain p-3 dark:border-neutral-50'
												/>
											);
										})}
									</div>
									<div className='flex flex-row flex-wrap justify-between'>
										<div className='pl-6 flex flex-row gap-2 justify-center align-middle items-center'>
											<button className='h-min w-min items-center rounded-lg bg-transparent p-0 align-middle text-black transition-all duration-500 dark:bg-transparent dark:text-white'>
												<HiOutlineChatBubbleOvalLeft className='h-8 w-8 p-0 hover:fill-blue-500' />
											</button>
											<button className='h-[32px] w-[32px] justify-center flex items-center rounded-lg bg-transparent p-0 align-middle text-black transition-all duration-500 dark:bg-transparent dark:text-white relative'>
												<BsHeart className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:fill-red-500' />
												<BsHeartFill className='opacity-0 hover:opacity-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:fill-red-500' />
											</button>
										</div>
										<NoSSR>
											<div className='px-3 items-center flex justify-center'>
												<span className=''>{dateString}</span>
											</div>
										</NoSSR>
									</div>
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
	const data = await getData();
	return {
		props: { posts: data },
	};
};
