import * as schema from '@drizzle/schema';
import { createClient } from '@libsql/client/http';
import { drizzle } from 'drizzle-orm/libsql';

interface Env {
	TURSO_DB_AUTH_TOKEN?: string;
	TURSO_DB_URL?: string;
}

const url = (process.env as unknown as Env).TURSO_DB_URL?.trim();
if (url === undefined) {
	throw new Error('TURSO_DB_URL is not defined');
}

const authToken = (process.env as unknown as Env).TURSO_DB_AUTH_TOKEN?.trim();
if (authToken === undefined) {
	throw new Error('TURSO_DB_AUTH_TOKEN is not defined');
}

export const drizzleClient = createClient({ url, authToken });

export const db = drizzle(drizzleClient, { schema });
