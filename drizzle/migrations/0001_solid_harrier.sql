CREATE TABLE `comment` (
	`id` integer PRIMARY KEY NOT NULL,
	`post_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`media` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`likes` integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE users ADD `liked_posts` text;--> statement-breakpoint
CREATE INDEX `comment_idx` ON `comment` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_idx` ON `post` (`user_id`);