import { GetServerSideProps } from 'next';
import Head from 'next/head';
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
	const res = await db.query.posts.findMany();
	console.log(`res: ${JSON.stringify(res, null, 2)}`);
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
									<th>ID</th>
									<th>USER ID</th>
									<th>CONTENT</th>
									<th>MEDIA</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{posts.map((post: Post) => (
									<tr key={post.id}>
										<td>{post.id}</td>
										<td>{post.user_id}</td>
										<td>{post.content}</td>
										{post.media?.map((media) => <td key={media.id}>{media.url}</td>)}
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

export const getServerSideProps: GetServerSideProps<{ posts: Post[] }> = async () => {
	const data = await getData();
	return {
		props: { posts: data },
	};
};
