import { postSchema } from '@/types/types';
import { db } from '@/utils/dbClient';
import { posts } from '@drizzle/schema';
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

	const isBanned = await db.query.banned_users.findFirst({
		where: (banned_users, { eq }) => eq(banned_users.user_id, session.user.id),
	});

	if (isBanned) {
		return res.status(403).send({
			message: 'User not allowed to post',
		});
	}

	if (!req.body) {
		return res.status(502).send({
			message: 'No Body Provided',
		});
	}

	const parsed = postSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(502).send({
			message: 'Invalid Body Provided',
		});
	}

	if (!parsed.data.id) {
		parsed.data.id = Math.floor(Math.random() * 1000000000);
	}

	console.log(`[API/Post] parsed input: ${JSON.stringify(parsed, null, 2)}`);

	const dbResponse = await db.insert(posts).values(parsed.data).returning().run();

	console.log(`[API/Post] dbResponse: ${JSON.stringify(dbResponse, null, 2)}`);

	return res.status(200).send({
		message: 'Post Created',
		post: dbResponse,
	});
}
