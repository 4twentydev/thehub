import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image")
});

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state")
  },
  (table) => ({
    providerCompoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] })
  })
);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull()
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] })
  })
);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  purpose: text("purpose"),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  visibility: text("visibility").notNull().default("public"),
  repoUrl: text("repo_url"),
  deployUrl: text("deploy_url"),
  domainUrl: text("domain_url"),
  docsUrl: text("docs_url"),
  figmaUrl: text("figma_url"),
  notionUrl: text("notion_url"),
  iconUrl: text("icon_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull()
});

export const dependencies = pgTable("dependencies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  packageName: text("package_name").notNull(),
  version: text("version").notNull(),
  category: text("category").notNull(),
  notes: text("notes")
});

export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  url: text("url"),
  notes: text("notes")
});

export const projectDependencies = pgTable(
  "project_dependencies",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    dependencyId: integer("dependency_id")
      .notNull()
      .references(() => dependencies.id, { onDelete: "cascade" })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.dependencyId] })
  })
);

export const projectTools = pgTable(
  "project_tools",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    toolId: integer("tool_id")
      .notNull()
      .references(() => tools.id, { onDelete: "cascade" })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.toolId] })
  })
);

export const envVars = pgTable("env_vars", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  scope: text("scope").notNull(),
  required: boolean("required").notNull().default(true),
  exampleMasked: text("example_masked"),
  isSet: boolean("is_set").notNull().default(false),
  notes: text("notes")
});

export const changelog = pgTable("changelog", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull()
});

// --------------- Assembly Metrics ---------------

export const assemblyMembers = pgTable("assembly_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default("assembler"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull()
});

export const assemblyJobs = pgTable("assembly_jobs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  targetQuantity: integer("target_quantity").notNull(),
  completedQuantity: integer("completed_quantity").notNull().default(0),
  unit: text("unit").notNull().default("units"),
  startDate: date("start_date", { mode: "string" }),
  dueDate: date("due_date", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull()
});

export const assemblyLogs = pgTable("assembly_logs", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .notNull()
    .references(() => assemblyMembers.id, { onDelete: "cascade" }),
  jobId: integer("job_id")
    .notNull()
    .references(() => assemblyJobs.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  defects: integer("defects").notNull().default(0),
  hoursWorked: numeric("hours_worked", { precision: 4, scale: 2 }).notNull(),
  notes: text("notes"),
  shiftDate: date("shift_date", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull()
});
