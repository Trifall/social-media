/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { tursoClient } from '../../../utils/tursoClient';

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
				const db = await tursoClient();

				const user = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [session.user.id] });

				if (user.rows?.length === 0) {
					const insertUserQuery = {
						sql: 'INSERT INTO users (id, name, email, profileImage) VALUES (?, ?, ?, ?)',
						args: [session.user.id.toString(), session.user.name, session.user.email, session.user.image],
					};

					const user = await db.execute(insertUserQuery);

					if (!user) {
						return false;
					}

					return true;
				}

				return true;
			} catch (error: any) {
				console.log(error.message);
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
			return session;
		},
	},
};

export default NextAuth(authOptions);
