import { z } from 'zod';

export const MediaSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	url: z.string(),
	name: z.string().optional(),
});

export const commentSchema = z.object({
	id: z.number().int().optional(),
	post_id: z.number().int(),
	user_id: z.string(),
	content: z.string(),
	created_at: z.string().optional(),
	likes: z.number().int().optional().default(0),
	users: z.object({ name: z.string(), profileImage: z.string() }).optional(),
});

export const postSchema = z.object({
	id: z.number().int().optional(),
	user_id: z.string(),
	content: z.string(),
	media: z.array(MediaSchema).max(4).optional(),
	created_at: z.string().optional(),
	likes: z.number().int().optional().default(0),
	users: z.object({ name: z.string(), profileImage: z.string() }).optional(),
	comments: z.array(commentSchema).optional(),
});

export type Post = z.infer<typeof postSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Comment = z.infer<typeof commentSchema>;

export type DeleteAccountPostData = {
	user_id: string;
};

export const deletePostSchema = z.object({
	user_id: z.string(),
	post_id: z.number(),
});

export type DeletePostData = z.infer<typeof deletePostSchema>;

export const likePostSchema = z.object({
	post_id: z.number().int(),
	user_id: z.string(),
	set_state: z.boolean(),
	is_comment: z.boolean().optional().default(false),
});

export type LikePostData = z.infer<typeof likePostSchema>;

export type LikedPost = {
	post_id: number;
	timestamp: Date;
};
