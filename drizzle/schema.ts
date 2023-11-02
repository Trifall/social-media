import { LikedPost, Media } from '@/types/types';
import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		profileImage: text('profileimage').notNull(),
		created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
		liked_posts: text('liked_posts', { mode: 'json' }).$type<LikedPost[]>(),
	},
	(users) => ({
		nameIdx: index('name_idx').on(users.name),
	})
);

export const posts = sqliteTable(
	'posts',
	{
		id: integer('id').primaryKey(),
		user_id: text('user_id').notNull(),
		content: text('content').notNull(),
		media: text('media', { mode: 'json' }).$type<Media[]>(),
		created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
		likes: integer('likes', { mode: 'number' }).default(0),
	},
	(post) => ({
		postIdx: index('post_idx').on(post.user_id),
	})
);

export const comments = sqliteTable(
	'comments',
	{
		id: integer('id').primaryKey(),
		post_id: integer('post_id').notNull(),
		user_id: text('user_id').notNull(),
		content: text('content').notNull(),
		created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
		likes: integer('likes', { mode: 'number' }).default(0),
	},
	(comment) => ({
		commentIdx: index('comment_idx').on(comment.post_id),
	})
);

export const postsRelations = relations(posts, ({ one, many }) => ({
	comments: many(comments),
	users: one(users, {
		fields: [posts.user_id],
		references: [users.id],
	}),
}));

export const userRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
}));

export const commentRelations = relations(comments, ({ one }) => ({
	posts: one(posts, {
		fields: [comments.post_id],
		references: [posts.id],
	}),
	users: one(users, {
		fields: [comments.user_id],
		references: [users.id],
	}),
}));
