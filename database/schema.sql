set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "posts" (
	"postId" serial NOT NULL,
	"userId" integer NOT NULL,
	"imageUrl" TEXT NOT NULL,
	"summary" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"body" TEXT NOT NULL,
	"createdAt" timestamptz NOT NULL default now(),
	"updatedAt" timestamptz NOT NULL default now(),
	CONSTRAINT "posts_pk" PRIMARY KEY ("postId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "comments" (
	"postId" integer NOT NULL,
	"userId" integer NOT NULL,
	"content" TEXT NOT NULL,
	"createdAt" timestamptz NOT NULL default now()
) WITH (
  OIDS=FALSE
);



CREATE TABLE "likePosts" (
	"postId" integer NOT NULL,
	"userId" integer NOT NULL
) WITH (
  OIDS=FALSE
);




ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "likePosts" ADD CONSTRAINT "likePosts_fk0" FOREIGN KEY ("postId") REFERENCES "posts"("postId");
ALTER TABLE "likePosts" ADD CONSTRAINT "likePosts_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
