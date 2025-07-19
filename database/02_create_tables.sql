-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" uuid PRIMARY KEY,
    "Email" text NOT NULL UNIQUE,
    "PasswordHash" text NOT NULL,
    "DisplayName" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);

-- Create ProgressEntries table
CREATE TABLE IF NOT EXISTS "ProgressEntries" (
    "Id" uuid PRIMARY KEY,
    "UserId" uuid NOT NULL,
    "Mood" integer NOT NULL,
    "JournalText" text,
    "Timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "FK_ProgressEntries_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Create CommunityPosts table
CREATE TABLE IF NOT EXISTS "CommunityPosts" (
    "Id" uuid PRIMARY KEY,
    "UserId" uuid NOT NULL,
    "AnonymousName" text NOT NULL,
    "Mood" integer NOT NULL,
    "Message" text NOT NULL,
    "Likes" integer NOT NULL DEFAULT 0,
    "Timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "FK_CommunityPosts_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Create ChatMessages table
CREATE TABLE IF NOT EXISTS "ChatMessages" (
    "Id" uuid PRIMARY KEY,
    "UserId" uuid NOT NULL,
    "UserName" text NOT NULL,
    "Message" text NOT NULL,
    "Timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "FK_ChatMessages_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Create PostLikes table
CREATE TABLE IF NOT EXISTS "PostLikes" (
    "Id" uuid PRIMARY KEY,
    "UserId" uuid NOT NULL,
    "PostId" uuid NOT NULL,
    "Timestamp" timestamp with time zone NOT NULL,
    CONSTRAINT "FK_PostLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_PostLikes_CommunityPosts_PostId" FOREIGN KEY ("PostId") REFERENCES "CommunityPosts" ("Id") ON DELETE CASCADE
);

-- Create unique index for PostLikes to prevent duplicate likes
CREATE UNIQUE INDEX IF NOT EXISTS "IX_PostLikes_UserId_PostId" ON "PostLikes" ("UserId", "PostId");

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IX_ProgressEntries_UserId" ON "ProgressEntries" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_CommunityPosts_UserId" ON "CommunityPosts" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_ChatMessages_UserId" ON "ChatMessages" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_PostLikes_UserId" ON "PostLikes" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_PostLikes_PostId" ON "PostLikes" ("PostId"); 