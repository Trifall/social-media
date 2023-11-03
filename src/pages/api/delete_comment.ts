import { ADMIN_USER_ID_LIST, deleteCommentSchema } from '@/types/types';
import { db } from '@/utils/dbClient';
import { comments } from '@drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user.id) {
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

	const parsed = deleteCommentSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(502).send({
			message: 'Invalid Body Provided',
		});
	}

	if (parsed.data.user_id !== session.user.id) {
		if (ADMIN_USER_ID_LIST.indexOf(session.user.id) === -1) {
			return res.status(401).send({
				message: 'Not Authorized',
			});
		}
	}

	console.log(`[API/Delete Comment] parsed input: ${JSON.stringify(parsed, null, 2)}`);

	// delete the post
	const deleteCommentDbResponse = await db.delete(comments).where(eq(comments.id, parsed.data.comment_id)).run();

	console.log(`[API/Delete Post] deletePostDbResponse: ${JSON.stringify(deleteCommentDbResponse, null, 2)}`);

	if (!deleteCommentDbResponse || deleteCommentDbResponse.rowsAffected !== 1) {
		return res.status(502).send({
			message: 'Error Deleting Comment',
		});
	}

	return res.status(200).send({
		message: 'Success',
		data: deleteCommentDbResponse,
	});
}
