/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/api/auth/[...nextauth].ts

import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { LikedPost, users } from '../../../../drizzle/schema';
import { buildDbClient } from '../../../utils/dbClient';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			liked_posts: LikedPost[];
		} & DefaultSession['user'];
	}
}

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		// ...add more providers here
	],
	callbacks: {
		async signIn(user) {
			const session = user as any;
			try {
				const db = await buildDbClient();

				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.id, session.user.id.toString()),
				});

				if (!user) {
					// const insertUserQuery = {
					// 	sql: 'INSERT INTO users (id, name, email, profileImage) VALUES (?, ?, ?, ?)',
					// 	args: [session.user.id.toString(), session.user.name, session.user.email, session.user.image],
					// };

					await db
						.insert(users)
						.values({
							id: session.user.id.toString(),
							name: session.user.name,
							email: session.user.email,
							profileImage: session.user.image,
							liked_posts: [],
						})
						.returning()
						.get();

					const userRecord = await db.query.users.findFirst({
						where: (users, { eq }) => eq(users.email, session.user.email),
					});

					if (!userRecord) {
						return false;
					}

					return true;
				}

				return true;
			} catch (error: any) {
				console.log(`[NextAuth/SignIn] ${error.message}`);
				return false;
			}
		},
		async jwt(data) {
			// Persist the OAuth access_token to the token right after signin
			const { token, account, user } = data;
			if (account) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			// Send properties to the client, like an access_token from a provider.
			(session as any).user = token.user;

			try {
				const db = await buildDbClient();
				const likedPostsResponse = await db.query.users.findMany({
					where: (users, { eq }) => eq(users.id, session.user.id),
					columns: {
						liked_posts: true,
					},
				});

				if (likedPostsResponse && likedPostsResponse.length === 0) {
					session.user.liked_posts = [];
				} else if (likedPostsResponse && likedPostsResponse.length > 0) {
					if (likedPostsResponse[0].liked_posts) {
						session.user.liked_posts = likedPostsResponse[0].liked_posts;
					}
				}
			} catch (error: any) {
				console.log(`[NextAuth/Session] ${error.message}`);
				session.user.liked_posts = [];
			}

			return session;
		},
	},
};

export default NextAuth(authOptions);
