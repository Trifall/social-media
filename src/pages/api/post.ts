import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { posts } from '../../../drizzle/schema';
import { buildDbClient } from '../../utils/dbClient';
import { authOptions } from './auth/[...nextauth]';

export const MediaSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	url: z.string(),
	name: z.string().optional(),
});

const postSchema = z.object({
	id: z.number().int().optional(),
	user_id: z.string(),
	content: z.string(),
	media: z.array(MediaSchema).max(4).optional(),
	created_at: z.string().optional(),
	likes: z.number().int().optional().default(0),
	users: z.object({ name: z.string(), profileImage: z.string() }).optional(),
});

export type Post = z.infer<typeof postSchema>;
export type Media = z.infer<typeof MediaSchema>;

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

	const db = buildDbClient();
	const dbResponse = await db.insert(posts).values(parsed.data).returning().run();

	console.log(`[API/Post] dbResponse: ${JSON.stringify(dbResponse, null, 2)}`);

	return res.status(200).send({
		message: 'Post Created',
		post: dbResponse,
	});
}
