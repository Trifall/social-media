import { commentSchema } from '@/types/types';
import { db } from '@/utils/dbClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { comments } from '../../../drizzle/schema';
import { authOptions } from './auth/[...nextauth]';

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

	const parsed = commentSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(502).send({
			message: 'Invalid Body Provided',
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
