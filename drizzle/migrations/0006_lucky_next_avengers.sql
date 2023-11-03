CREATE TABLE `banned_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `banned_usersIdx` ON `banned_users` (`user_id`);--> statement-breakpoint
ALTER TABLE `comments` DROP COLUMN `media`;