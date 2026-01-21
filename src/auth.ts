import { createHash } from "crypto";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

function getOwnerPins() {
  return (process.env.OWNER_PINS ?? "")
    .split(",")
    .map((pin) => pin.trim())
    .filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        pin: { label: "PIN", type: "password" }
      },
      async authorize(credentials) {
        const pin = credentials?.pin?.toString();
        if (!pin) return null;

        const ownerPins = getOwnerPins();
        if (!ownerPins.includes(pin)) return null;

        const pinHash = createHash("sha256").update(pin).digest("hex").slice(0, 16);
        const id = `owner-${pinHash}`;

        const existing = await db.query.users.findFirst({
          where: eq(users.id, id)
        });

        if (!existing) {
          await db.insert(users).values({
            id,
            name: "Owner",
            email: `${id}@4twenty.dev`
          });
        }

        return { id, name: "Owner", email: `${id}@4twenty.dev` };
      }
    })
  ],
  pages: {
    signIn: "/login"
  }
});
