import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		profileImage: text('profileimage').notNull(),
		created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	},
	(users) => ({
		nameIdx: index('name_idx').on(users.name),
	})
);

export const frameworks = sqliteTable(
	'frameworks',
	{
		id: integer('id').primaryKey(),
		name: text('name').notNull(),
		language: text('language').notNull(),
		url: text('url').notNull(),
		stars: integer('stars').notNull(),
	},
	(frameworks) => ({
		frameworkIdx: index('framework_idx').on(frameworks.name),
	})
);
