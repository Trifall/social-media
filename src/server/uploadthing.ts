/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import * as z from 'zod';

import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const f = createUploadthing({
	errorFormatter: (err) => {
		return {
			message: err.message,
			zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
		};
	},
});

const auth = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	return session?.user?.id;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const auth = (_req: NextApiRequest, _res: NextApiResponse) => ({ id: 'fakeId' }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
		// .input(z.object({ postId: z.string() }))
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req, res }) => {
			// This code runs on your server before upload
			const user = await auth(req, res);

			// If you throw, the user will not be able to upload
			if (!user) {
				throw new Error('Unauthorized');
			}
			console.log(`[UploadThing/Middleware] user: ${user}`);

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log('[UploadThing/Middleware] Upload complete for userId:', metadata.userId);

			console.log('[UploadThing/Middleware] file url', file.url);
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
