import { commentSchema } from '@/types/types';
import { db } from '@/utils/dbClient';
import { comments } from '@drizzle/schema';
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

	const parsed = commentSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(502).send({
			message: 'Invalid Body Provided',
		});
	}

	const isBanned = await db.query.banned_users.findFirst({
		where: (banned_users, { eq }) => eq(banned_users.user_id, session.user.id),
	});

	if (isBanned) {
		return res.status(403).send({
			message: 'User not allowed to post',
		});
	}

	if (!parsed.data.id) {
		parsed.data.id = Math.floor(Math.random() * 1000000000);
	}

	console.log(`[API/Comment] parsed input: ${JSON.stringify(parsed, null, 2)}`);

	const dbResponse = await db.insert(comments).values(parsed.data).returning().run();

	console.log(`[API/Comment] res: ${JSON.stringify(dbResponse, null, 2)}`);

	return res.status(200).send({
		message: 'Success',
		data: dbResponse,
	});
}
