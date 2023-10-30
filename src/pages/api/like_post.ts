import { eq, sql } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { LikedPost, comments, posts, users } from '../../../drizzle/schema';
import { buildDbClient } from '../../utils/dbClient';
import { authOptions } from './auth/[...nextauth]';

const likePostSchema = z.object({
	post_id: z.number().int(),
	user_id: z.string(),
	set_state: z.boolean(),
	is_comment: z.boolean().optional().default(false),
});

export type LikePostData = z.infer<typeof likePostSchema>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).send({
			message: 'Not Authorized',
		});
	}

	if (req.method !== 'POST') {
		return res.status(502).send({
			message: 'Incorrect Request Method - Only POST Allowed',
		});
	}

	if (!req.body) {
		return res.status(502).send({
			message: 'No Body Provided',
		});
	}

	const parsed = likePostSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(502).send({
			message: 'Invalid Body Provided',
		});
	}

	console.log(`[API/like_post] parsed input: ${JSON.stringify(parsed, null, 2)}`);

	if (parsed.data.user_id.trim() !== session.user.id.trim()) {
		return res.status(502).send({
			message: 'User ID does not match session user ID',
		});
	}

	const db = buildDbClient();
	const liked_posts_data: LikedPost[] = [];

	const likedPostsResponse = await db.query.users.findMany({
		where: (users, { eq }) => eq(users.id, parsed.data.user_id.trim()),
		columns: {
			liked_posts: true,
		},
	});

	if (!likedPostsResponse || likedPostsResponse.length === 0) {
		return res.status(502).send({
			message: 'Liked Posts could not be found',
		});
	}

	let likedPosts = likedPostsResponse[0]?.liked_posts;

	if (parsed.data.set_state === true) {
		if (!likedPosts) {
			likedPosts = [];
		}

		liked_posts_data.push(...likedPosts, {
			post_id: parsed.data.post_id,
			timestamp: new Date(),
		} as LikedPost);
	} else {
		if (!likedPosts || likedPosts.length === 0) {
			return res.status(502).send({
				message: 'User has no liked posts to remove.',
			});
		} else {
			liked_posts_data.push(...likedPosts.filter((post: LikedPost) => post.post_id !== parsed.data.post_id));
		}
	}

	const userDbResponse = await db
		.update(users)
		.set({
			liked_posts: liked_posts_data,
		})
		.where(eq(users.id, parsed.data.user_id))
		.execute();

	if (!userDbResponse) {
		return res.status(502).send({
			message: 'Error updating user liked posts',
		});
	}

	if (userDbResponse.rowsAffected === 0) {
		return res.status(502).send({
			message: 'Error updating user liked posts',
		});
	}

	if (!parsed.data.is_comment) {
		const postDbResponse = await db
			.update(posts)
			.set({
				likes: parsed.data.set_state ? sql`${posts.likes} + 1` : sql`${posts.likes} - 1`,
			})
			.where(eq(posts.id, parsed.data.post_id))
			.execute();

		if (!postDbResponse) {
			return res.status(502).send({
				message: 'Error updating post likes counter',
			});
		}

		if (postDbResponse.rowsAffected === 0) {
			return res.status(502).send({
				message: 'Error updating post likes counter',
			});
		}
	} else {
		const commentDbResponse = await db
			.update(comments)
			.set({
				likes: parsed.data.set_state ? sql`${comments.likes} + 1` : sql`${comments.likes} - 1`,
			})
			.where(eq(comments.id, parsed.data.post_id))
			.execute();

		if (!commentDbResponse) {
			return res.status(502).send({
				message: 'Error updating comment likes counter',
			});
		}

		if (commentDbResponse.rowsAffected === 0) {
			return res.status(502).send({
				message: 'Error updating comment likes counter',
			});
		}
	}

	console.log(`[API/like_post] Operation Complete. Rows affected: ${userDbResponse.rowsAffected}`);

	return res.status(200).send({
		message: 'Success',
		data: userDbResponse,
	});
}
