import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';
import { posts } from '../../../drizzle/schema';
import { db } from '../../utils/dbClient';
import { authOptions } from './auth/[...nextauth]';

const deletePostSchema = z.object({
	user_id: z.string(),
	post_id: z.number(),
});

export type DeletePostData = z.infer<typeof deletePostSchema>;

// TODO: need to test this

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

	const parsed = deletePostSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(502).send({
			message: 'Invalid Body Provided',
		});
	}

	if (parsed.data.user_id !== session.user.id) {
		return res.status(401).send({
			message: 'Not Authorized',
		});
	}

	console.log(`[API/Delete Post] parsed input: ${JSON.stringify(parsed, null, 2)}`);

	// get the post to retrieve the user_id and media
	const postDbResponse = await db.query.posts.findFirst({
		where: (posts, { eq }) => eq(posts.id, parsed.data.post_id),
	});

	if (!postDbResponse) {
		return res.status(404).send({
			message: 'Post Not Found',
		});
	}

	// check if the user_id matches the session user id
	if (postDbResponse.user_id !== session.user.id) {
		return res.status(401).send({
			message: 'Not Authorized',
		});
	}

	// check for media and delete it
	if (postDbResponse.media && postDbResponse.media.length > 0) {
		const utapi = new UTApi();
		const mediaIDs = postDbResponse.media.map((m) => m.id!);

		if (mediaIDs && mediaIDs.length > 0) {
			try {
				console.log(`[API/Delete Post] Deleting Media: ${JSON.stringify(mediaIDs, null, 2)}`);
				const deleteFilesResponse = await utapi.deleteFiles(mediaIDs);
				console.log(`[API/Delete Post] deleteFilesResponse: ${JSON.stringify(deleteFilesResponse, null, 2)}`);
			} catch (e) {
				console.log(`[API/Delete Post] error deleting media: ${JSON.stringify(e, null, 2)}`);
				return res.status(502).send({
					message: 'Error Deleting Media',
				});
			}
		}
	}

	// delete the post
	const deletePostDbResponse = await db.delete(posts).where(eq(posts.id, parsed.data.post_id)).run();

	console.log(`[API/Delete Post] deletePostDbResponse: ${JSON.stringify(deletePostDbResponse, null, 2)}`);

	if (!deletePostDbResponse || deletePostDbResponse.rowsAffected !== 1) {
		return res.status(502).send({
			message: 'Error Deleting Post',
		});
	}

	return res.status(200).send({
		message: 'Success',
		data: deletePostDbResponse,
	});
}
