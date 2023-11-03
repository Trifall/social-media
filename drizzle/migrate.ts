import { createClient } from '@libsql/client';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

console.log(`process.env.TURSO_DB_URL: ${process.env.TURSO_DB_URL}`);
console.log(`process.env.TURSO_DB_AUTH_TOKEN: ${process.env.TURSO_DB_AUTH_TOKEN}`);

const client = createClient({
	url: process.env.TURSO_DB_URL as string,
	authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
});

const db = drizzle(client);

async function main() {
	try {
		await migrate(db, {
			migrationsFolder: 'drizzle/migrations',
		});
		console.log('Tables migrated!');
		process.exit(0);
	} catch (error) {
		console.error('Error performing migration: ', error);
		process.exit(1);
	}
}

main();
