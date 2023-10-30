import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { posts } from '../../../drizzle/schema';
import { buildDbClient } from '../../utils/dbClient';
import { authOptions } from './auth/[...nextauth]';

const commentSchema = z.object({
	id: z.number().int().optional(),
	user_id: z.string(),
	post_id: z.number().int(),
	content: z.string(),
	created_at: z.string().optional(),
	likes: z.number().int().optional().default(0),
	users: z.object({ name: z.string(), profileImage: z.string() }).optional(),
});

export type Comment = z.infer<typeof commentSchema>;

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

	const db = buildDbClient();
	const dbResponse = await db.insert(posts).values(parsed.data).returning().run();

	console.log(`[API/Comment] res: ${JSON.stringify(dbResponse, null, 2)}`);

	return res.status(200).send({
		message: 'Success',
		data: dbResponse,
	});
}
