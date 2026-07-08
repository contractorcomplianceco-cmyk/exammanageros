import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth";
import { requireAuth, requirePermission } from "../middlewares/auth";
import { insertDomainState, isSeeded, markSeeded } from "../services/domain-repository";
import { readFile } from "node:fs/promises";
import path from "node:path";

const router: IRouter = Router();
const seedPath = path.resolve(process.cwd(), "artifacts/api-server/src/data/seed.json");

router.post("/admin/seed", requireAuth, requirePermission("admin:seed"), async (_req, res) => {
  if (process.env.NODE_ENV === "production" && (await isSeeded())) {
    res.status(403).json({ message: "Database already seeded" });
    return;
  }
  const raw = await readFile(seedPath, "utf8");
  const state = JSON.parse(raw);
  await insertDomainState(state);
  await markSeeded();
  res.json({ message: "Seed complete", counts: Object.fromEntries(Object.entries(state).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])) });
});

router.post("/admin/bootstrap-users", async (_req, res) => {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_BOOTSTRAP !== "1") {
    res.status(403).json({ message: "Bootstrap disabled" });
    return;
  }
  const users = [
    { name: "Rose Taylor", email: process.env.BOOTSTRAP_ROSE_EMAIL ?? "rose@contractorcomplianceauthority.com", password: process.env.BOOTSTRAP_ROSE_PASSWORD, role: "admin" as const },
    { name: "Carmen Aburoda", email: process.env.BOOTSTRAP_CARMEN_EMAIL ?? "carmen@contractorcomplianceauthority.com", password: process.env.BOOTSTRAP_CARMEN_PASSWORD, role: "admin" as const },
  ];
  const created: string[] = [];
  for (const u of users) {
    if (!u.password) continue;
    const email = u.email.trim().toLowerCase();
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing) continue;
    await db.insert(usersTable).values({ name: u.name, email, passwordHash: hashPassword(u.password), role: u.role, status: "active" });
    created.push(email);
  }
  res.json({ created });
});

export default router;
