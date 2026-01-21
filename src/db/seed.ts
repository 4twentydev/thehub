import "dotenv/config";

import { db } from "@/db";
import { changelog, dependencies, envVars, projectDependencies, projects, projectTools, tools } from "@/db/schema";

const projectSeed = [
  {
    name: "Yard Inventory Map",
    slug: "yard-inventory-map",
    description: "Live map of pallets, bins, and equipment across the yard grid.",
    purpose: "Reduce dock search time with geofenced inventory overlays.",
    status: "active",
    priority: "critical",
    visibility: "public",
    repoUrl: "https://github.com/4twenty/yard-inventory-map",
    deployUrl: "https://yard-inventory-map.vercel.app",
    domainUrl: "https://yard.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/yard",
    figmaUrl: "https://www.figma.com/file/yard",
    notionUrl: "https://notion.so/yard"
  },
  {
    name: "Pallet Tracker",
    slug: "pallet-tracker",
    description: "RFID-powered tracking of pallets across multiple warehouses.",
    purpose: "Eliminate phantom pallet counts and automate audit trails.",
    status: "active",
    priority: "high",
    visibility: "public",
    repoUrl: "https://github.com/4twenty/pallet-tracker",
    deployUrl: "https://pallet-tracker.vercel.app",
    domainUrl: "https://pallets.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/pallets",
    figmaUrl: "https://www.figma.com/file/pallets",
    notionUrl: "https://notion.so/pallets"
  },
  {
    name: "Shop Inventory",
    slug: "shop-inventory",
    description: "Inventory dashboard for retail SKU tracking and reorder alerts.",
    purpose: "Keep store teams aligned on stock levels.",
    status: "in-review",
    priority: "medium",
    visibility: "public",
    repoUrl: "https://github.com/4twenty/shop-inventory",
    deployUrl: "https://shop-inventory.vercel.app",
    domainUrl: "https://shop.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/shop",
    figmaUrl: "https://www.figma.com/file/shop",
    notionUrl: "https://notion.so/shop"
  },
  {
    name: "Jeweled eCommerce",
    slug: "jeweled-ecommerce",
    description: "Luxury jewelry commerce storefront with custom configurator.",
    purpose: "Support bespoke ordering with operational transparency.",
    status: "paused",
    priority: "high",
    visibility: "public",
    repoUrl: "https://github.com/4twenty/jeweled-ecommerce",
    deployUrl: "https://jeweled.vercel.app",
    domainUrl: "https://jeweled.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/jeweled",
    figmaUrl: "https://www.figma.com/file/jeweled",
    notionUrl: "https://notion.so/jeweled"
  },
  {
    name: "SignForge",
    slug: "signforge",
    description: "Custom sign builder and production tracking hub.",
    purpose: "Connect design approvals with CNC production.",
    status: "active",
    priority: "medium",
    visibility: "public",
    repoUrl: "https://github.com/4twenty/signforge",
    deployUrl: "https://signforge.vercel.app",
    domainUrl: "https://signforge.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/signforge",
    figmaUrl: "https://www.figma.com/file/signforge",
    notionUrl: "https://notion.so/signforge"
  },
  {
    name: "CNC Coach Toolkit",
    slug: "cnc-coach-toolkit",
    description: "Operational toolkit for CNC operators and shop supervisors.",
    purpose: "Training modules + live checklist for machine readiness.",
    status: "needs-attention",
    priority: "high",
    visibility: "public",
    repoUrl: "https://github.com/4twenty/cnc-coach",
    deployUrl: "https://cnc-coach.vercel.app",
    domainUrl: "https://cnc.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/cnc",
    figmaUrl: "https://www.figma.com/file/cnc",
    notionUrl: "https://notion.so/cnc"
  }
];

const dependencySeed = [
  {
    name: "Drizzle ORM",
    packageName: "drizzle-orm",
    version: "0.33.0",
    category: "Database",
    notes: "Typed queries and migration management."
  },
  {
    name: "Auth.js",
    packageName: "next-auth",
    version: "5.0.0-beta.25",
    category: "Auth",
    notes: "Credentials + session management for owner mode."
  },
  {
    name: "Framer Motion",
    packageName: "framer-motion",
    version: "11.3.28",
    category: "Motion",
    notes: "Shared layout transitions for grid-to-detail flows."
  }
];

const toolSeed = [
  {
    name: "Neon",
    category: "Database",
    url: "https://neon.tech",
    notes: "Serverless Postgres"
  },
  {
    name: "Vercel",
    category: "Deploy",
    url: "https://vercel.com",
    notes: "Frontend + edge deploys"
  },
  {
    name: "Vercel Blob",
    category: "Storage",
    url: "https://vercel.com/storage/blob",
    notes: "Project icons + screenshots"
  }
];

async function runSeed() {
  console.log("Seeding database...");

  const insertedProjects = await db.insert(projects).values(projectSeed).returning();
  const insertedDependencies = await db.insert(dependencies).values(dependencySeed).returning();
  const insertedTools = await db.insert(tools).values(toolSeed).returning();

  if (insertedProjects[0] && insertedDependencies[0]) {
    await db.insert(projectDependencies).values({
      projectId: insertedProjects[0].id,
      dependencyId: insertedDependencies[0].id
    });
  }

  if (insertedProjects[0] && insertedTools[0]) {
    await db.insert(projectTools).values({
      projectId: insertedProjects[0].id,
      toolId: insertedTools[0].id
    });
  }

  if (insertedProjects[0]) {
    await db.insert(envVars).values({
      projectId: insertedProjects[0].id,
      key: "YARD_WEBSOCKET_URL",
      scope: "vercel",
      required: true,
      exampleMasked: "wss://***",
      isSet: false,
      notes: "Realtime feed endpoint"
    });

    await db.insert(changelog).values({
      projectId: insertedProjects[0].id,
      title: "Realtime batching tuned",
      body: "Adjusted websocket batch window to 2s for fewer missed scans."
    });
  }

  console.log("Seed complete.");
}

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
