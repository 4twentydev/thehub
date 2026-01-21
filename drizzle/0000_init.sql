CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "name" text,
  "email" text,
  "email_verified" timestamp,
  "image" text
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "id" serial PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" varchar(255) NOT NULL,
  "provider" varchar(255) NOT NULL,
  "provider_account_id" varchar(255) NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" varchar(255),
  "scope" text,
  "id_token" text,
  "session_state" text,
  CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider", "provider_account_id")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" serial PRIMARY KEY,
  "session_token" varchar(255) NOT NULL UNIQUE,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" varchar(255) NOT NULL,
  "token" varchar(255) NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier", "token")
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text NOT NULL,
  "purpose" text,
  "status" text NOT NULL,
  "priority" text NOT NULL,
  "visibility" text NOT NULL DEFAULT 'public',
  "repo_url" text,
  "deploy_url" text,
  "domain_url" text,
  "docs_url" text,
  "figma_url" text,
  "notion_url" text,
  "icon_url" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "dependencies" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "package_name" text NOT NULL,
  "version" text NOT NULL,
  "category" text NOT NULL,
  "notes" text
);

CREATE TABLE IF NOT EXISTS "tools" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "category" text NOT NULL,
  "url" text,
  "notes" text
);

CREATE TABLE IF NOT EXISTS "project_dependencies" (
  "project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "dependency_id" integer NOT NULL REFERENCES "dependencies"("id") ON DELETE CASCADE,
  CONSTRAINT "project_dependencies_pk" PRIMARY KEY("project_id", "dependency_id")
);

CREATE TABLE IF NOT EXISTS "project_tools" (
  "project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "tool_id" integer NOT NULL REFERENCES "tools"("id") ON DELETE CASCADE,
  CONSTRAINT "project_tools_pk" PRIMARY KEY("project_id", "tool_id")
);

CREATE TABLE IF NOT EXISTS "env_vars" (
  "id" serial PRIMARY KEY,
  "project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "key" text NOT NULL,
  "scope" text NOT NULL,
  "required" boolean NOT NULL DEFAULT true,
  "example_masked" text,
  "is_set" boolean NOT NULL DEFAULT false,
  "notes" text
);

CREATE TABLE IF NOT EXISTS "changelog" (
  "id" serial PRIMARY KEY,
  "project_id" integer NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);
