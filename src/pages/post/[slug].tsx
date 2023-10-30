import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useMemo } from 'react';
import { LikedPost } from '../../../drizzle/schema';
import PostCard from '../../components/PostCard';
import { buildDbClient } from '../../utils/dbClient';
import { Post } from '../api/post';

type PostPageProps = {
	post?: Post;
	liked_posts?: LikedPost[];
};

async function getPost(post_id: number) {
	const db = buildDbClient();

	const postResponse = await db.query.posts.findFirst({
		where: (posts, { eq }) => eq(post_id as any, posts.id),
		with: {
			users: {
				columns: {
					id: true,
					name: true,
					profileImage: true,
				},
			},
			comments: {
				with: {
					users: {
						columns: {
							id: true,
							name: true,
							profileImage: true,
						},
					},
				},
				columns: {
					id: true,
					content: true,
					created_at: true,
					likes: true,
					post_id: true,
					user_id: true,
				},
			},
		},
	});

	console.log(`[gSSP/getPost/getData] Post Response: ${JSON.stringify(postResponse, null, 2)}`);

	return postResponse as unknown as Post;
}

export default function PostPage({ post }: PostPageProps) {
	// auth hook
	const session = useSession();
	// get user object
	const user = session?.data?.user;

	// sort comments by likes, and then by date if likes are equal
	const comments = useMemo(() => {
		if (!post?.comments) return [];
		return post.comments?.sort((a, b) => {
			if (a.likes === b.likes) {
				if (!a.created_at || !b.created_at) {
					return 0;
				}
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			}
			return b.likes - a.likes;
		});
	}, [post?.comments]);

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<>
			<Head>
				<title>{post.users?.name ? post.users?.name + `'s Post` : `Social Media Post`}</title>
			</Head>
			<div className='px-4 flex flex-col gap-2'>
				<PostCard post={post} user={user} />

				{comments?.map((comment) => (
					<div key={comment.id} className='flex flex-col gap-2 bg-gray-800 p-4 rounded-xl'>
						<div className='flex flex-row gap-2'>
							<div className='relative h-8 w-8'>
								<Image
									sizes='100%'
									className='rounded-full object-cover m-0'
									fill
									quality={100}
									alt='profile'
									src={comment.users?.profileImage ?? ''}
								/>
							</div>
							<div className='flex flex-col gap-1'>
								<div className='flex flex-row items-center gap-2'>
									<div className='font-bold'>{comment.users?.name}</div>
									<div className='text-gray-500'>{comment.created_at}</div>
								</div>
								<div>{comment.content}</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
	console.log(`[gSSP/getPost] params: ${JSON.stringify(params, null, 2)}`);

	if (!params?.slug) {
		return {
			props: { post: null },
		};
	}

	let post_id: number;

	try {
		post_id = parseInt(params.slug as string);
		console.log(`post_id: ${post_id}`);
		if (Number.isNaN(post_id)) {
			throw new Error('[gSSP/getPost] post_id is NaN');
		}
	} catch (e) {
		console.log(`[gSSP/getPost] Error parsing post_id: ${e}`);
		return {
			props: { post: null },
		};
	}

	const postData = await getPost(post_id);
	if (!postData) {
		return {
			props: { post: null },
		};
	}

	return {
		props: { post: postData },
	};
};
