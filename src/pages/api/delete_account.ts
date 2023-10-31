import { eq } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { users } from '../../../drizzle/schema';
import { buildDbClient } from '../../utils/dbClient';
import { authOptions } from './auth/[...nextauth]';

const deleteAccountSchema = z.object({
	user_id: z.string(),
});

export type DeleteAccountRequestData = z.infer<typeof deleteAccountSchema>;

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

	const parsed = deleteAccountSchema.safeParse(req.body);

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

	console.log(`[API/Delete Account] parsed input: ${JSON.stringify(parsed, null, 2)}`);

	const db = buildDbClient();
	// const dbResponse = await db.insert(comments).values(parsed.data).returning().run();
	const dbResponse = await db.delete(users).where(eq(users.id, parsed.data.user_id)).run();

	console.log(`[API/Delete Account] res: ${JSON.stringify(dbResponse, null, 2)}`);

	return res.status(200).send({
		message: 'Success',
		data: dbResponse,
	});
}
