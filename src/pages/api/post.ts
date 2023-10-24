import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { posts } from '../../../drizzle/schema';
import { buildDbClient } from '../../utils/dbClient';

export const runtime = 'edge';

const Media = z.object({
	id: z.number().int(),
	type: z.string(),
	url: z.string(),
});

const postSchema = z.object({
	id: z
		.number()
		.int()
		.optional()
		.default(Math.floor(Math.random() * 1000000000)),
	user_id: z.string(),
	content: z.string(),
	media: z.array(Media).max(4).optional(),
	created_at: z.string().optional(),
	likes: z.number().int().optional().default(0),
});

export type Post = z.infer<typeof postSchema>;
export type Media = z.infer<typeof Media>;

export default async function handler(req: NextRequest) {
	// Create redirect url
	const addNewUrl = req.nextUrl.clone();
	addNewUrl.pathname = '/';

	if (req.method !== 'POST') {
		return NextResponse.json(
			{
				message: 'Incorrect Request Method - Only POST Allowed',
			},
			{
				status: 502,
			}
		);
	}

	if (!req.body) {
		return NextResponse.json(
			{
				message: 'No Body Provided',
			},
			{
				status: 502,
			}
		);
	}

	const parsed = postSchema.safeParse(await req.json());

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: 'Missing Required Fields',
			},
			{
				status: 502,
			}
		);
	}

	const db = buildDbClient();
	const res = await db.insert(posts).values(parsed.data).returning().run();

	console.log(`res: ${JSON.stringify(res, null, 2)}`);

	return NextResponse.json(
		{
			message: 'Success',
			data: res,
		},
		{
			status: 200,
		}
	);
}
