import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useMemo } from 'react';
import { LikedPost } from '../../../drizzle/schema';
import CommentCard from '../../components/CommentCard';
import PostCard from '../../components/PostCard';
import { buildDbClient } from '../../utils/dbClient';
import { Comment, Post } from '../api/post';

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
		}) as Comment[];
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
				{comments?.map((comment) => <CommentCard comment={comment} key={comment.id} user={user} />)}
			</div>
		</>
	);
}

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
	console.log(`[gSSP/getPost] params: ${JSON.stringify(params, null, 2)}`);

	if (!params?.id) {
		return {
			props: { post: null },
		};
	}

	let post_id: number;

	try {
		post_id = parseInt(params.id as string);
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
