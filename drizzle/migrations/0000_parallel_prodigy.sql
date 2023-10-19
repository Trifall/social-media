CREATE TABLE `frameworks` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`language` text NOT NULL,
	`url` text NOT NULL,
	`stars` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`profileimage` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `framework_idx` ON `frameworks` (`name`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `users` (`name`);