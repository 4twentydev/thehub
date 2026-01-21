export type ProjectStatus = "active" | "paused" | "archived" | "idea" | "needs-attention" | "in-review";
export type ProjectPriority = "low" | "medium" | "high" | "critical";

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  purpose: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  tags: string[];
  stack: string[];
  repoUrl: string;
  deployUrl: string;
  domainUrl: string;
  docsUrl?: string;
  figmaUrl?: string;
  notionUrl?: string;
  updatedAt: string;
  needsAttention?: string[];
  buildNotes: string[];
}

export const projects: ProjectSummary[] = [
  {
    id: "proj-yard-inventory-map",
    name: "Yard Inventory Map",
    slug: "yard-inventory-map",
    description: "Live map of pallets, bins, and equipment across the yard grid.",
    purpose: "Reduce dock search time with geofenced inventory overlays.",
    status: "active",
    priority: "critical",
    tags: ["logistics", "mapping", "real-time"],
    stack: ["Next.js", "Tailwind", "Neon", "Drizzle", "Mapbox"],
    repoUrl: "https://github.com/4twenty/yard-inventory-map",
    deployUrl: "https://yard-inventory-map.vercel.app",
    domainUrl: "https://yard.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/yard",
    figmaUrl: "https://www.figma.com/file/yard",
    notionUrl: "https://notion.so/yard",
    updatedAt: "2024-10-05",
    needsAttention: ["Rotate Mapbox token", "Env var: YARD_WEBSOCKET_URL"],
    buildNotes: [
      "Map clustering optimized for 12k markers.",
      "Realtime updates batched to 2s intervals.",
      "Incident runbook includes offline map fallback."
    ]
  },
  {
    id: "proj-pallet-tracker",
    name: "Pallet Tracker",
    slug: "pallet-tracker",
    description: "RFID-powered tracking of pallets across multiple warehouses.",
    purpose: "Eliminate phantom pallet counts and automate audit trails.",
    status: "active",
    priority: "high",
    tags: ["rfid", "inventory"],
    stack: ["Next.js", "Auth.js", "Neon", "Drizzle", "Stripe"],
    repoUrl: "https://github.com/4twenty/pallet-tracker",
    deployUrl: "https://pallet-tracker.vercel.app",
    domainUrl: "https://pallets.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/pallets",
    figmaUrl: "https://www.figma.com/file/pallets",
    notionUrl: "https://notion.so/pallets",
    updatedAt: "2024-09-27",
    needsAttention: ["Backfill missing scans", "Dependency update: @tanstack/react-table"],
    buildNotes: [
      "RFID scan ingestion uses edge queue.",
      "Owner mode supports audit approvals.",
      "Ops checklist includes nightly reconciliation."
    ]
  },
  {
    id: "proj-shop-inventory",
    name: "Shop Inventory",
    slug: "shop-inventory",
    description: "Inventory dashboard for retail SKU tracking and reorder alerts.",
    purpose: "Keep store teams aligned on stock levels.",
    status: "in-review",
    priority: "medium",
    tags: ["retail", "dashboard"],
    stack: ["Next.js", "Tailwind", "Neon", "Drizzle", "Supabase"],
    repoUrl: "https://github.com/4twenty/shop-inventory",
    deployUrl: "https://shop-inventory.vercel.app",
    domainUrl: "https://shop.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/shop",
    figmaUrl: "https://www.figma.com/file/shop",
    notionUrl: "https://notion.so/shop",
    updatedAt: "2024-08-18",
    needsAttention: ["Add reorder threshold rules"],
    buildNotes: ["Ops runbook includes POS sync test.", "Bulk import uses CSV verifier."]
  },
  {
    id: "proj-jeweled",
    name: "Jeweled eCommerce",
    slug: "jeweled-ecommerce",
    description: "Luxury jewelry commerce storefront with custom configurator.",
    purpose: "Support bespoke ordering with operational transparency.",
    status: "paused",
    priority: "high",
    tags: ["commerce", "luxury"],
    stack: ["Next.js", "Tailwind", "Neon", "Drizzle", "Stripe"],
    repoUrl: "https://github.com/4twenty/jeweled-ecommerce",
    deployUrl: "https://jeweled.vercel.app",
    domainUrl: "https://jeweled.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/jeweled",
    figmaUrl: "https://www.figma.com/file/jeweled",
    notionUrl: "https://notion.so/jeweled",
    updatedAt: "2024-07-02",
    needsAttention: ["Review abandoned cart flow"],
    buildNotes: ["Configurator uses shared layout animations.", "Order ops checklist includes gem certification upload."]
  },
  {
    id: "proj-signforge",
    name: "SignForge",
    slug: "signforge",
    description: "Custom sign builder and production tracking hub.",
    purpose: "Connect design approvals with CNC production.",
    status: "active",
    priority: "medium",
    tags: ["manufacturing", "cmyk"],
    stack: ["Next.js", "Tailwind", "Neon", "Drizzle", "Vercel"],
    repoUrl: "https://github.com/4twenty/signforge",
    deployUrl: "https://signforge.vercel.app",
    domainUrl: "https://signforge.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/signforge",
    figmaUrl: "https://www.figma.com/file/signforge",
    notionUrl: "https://notion.so/signforge",
    updatedAt: "2024-10-01",
    needsAttention: ["Env var: SIGNFORGE_WEBHOOK_SECRET"],
    buildNotes: ["Production status syncs from CNC queue.", "Runbook includes decal reprint checklist."]
  },
  {
    id: "proj-cnc-coach",
    name: "CNC Coach Toolkit",
    slug: "cnc-coach-toolkit",
    description: "Operational toolkit for CNC operators and shop supervisors.",
    purpose: "Training modules + live checklist for machine readiness.",
    status: "needs-attention",
    priority: "high",
    tags: ["training", "ops"],
    stack: ["Next.js", "Tailwind", "Neon", "Drizzle", "Auth.js"],
    repoUrl: "https://github.com/4twenty/cnc-coach",
    deployUrl: "https://cnc-coach.vercel.app",
    domainUrl: "https://cnc.4twenty.dev",
    docsUrl: "https://docs.4twenty.dev/cnc",
    figmaUrl: "https://www.figma.com/file/cnc",
    notionUrl: "https://notion.so/cnc",
    updatedAt: "2024-10-03",
    needsAttention: ["Add incident response checklist", "Dependency update: framer-motion"],
    buildNotes: ["Mobile-first training cards.", "Ops playbooks stored in Notion sync."]
  }
];

export const dependenciesCatalog = [
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

export const toolsCatalog = [
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
