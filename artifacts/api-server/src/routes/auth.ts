import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createSession, destroySession, toUserProfile, verifyPassword } from "../lib/auth";
import { requireAuth } from "../middlewares/auth";

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const router: IRouter = Router();
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/",
};

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }
  const email = parsed.data.email.trim().toLowerCase();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  if (user.status !== "active") {
    res.status(401).json({ message: "This account has been deactivated" });
    return;
  }
  const token = await createSession(user.id);
  await db.update(usersTable).set({ lastLoginAt: new Date() }).where(eq(usersTable.id, user.id));
  res.cookie("exammanageros_token", token, COOKIE_OPTS);
  res.json({ token, user: toUserProfile({ ...user, lastLoginAt: new Date() }) });
});

router.post("/auth/logout", requireAuth, async (req, res) => {
  if (req.sessionToken) await destroySession(req.sessionToken);
  res.clearCookie("exammanageros_token", { path: "/" });
  res.json({ message: "Logged out" });
});

router.get("/auth/me", requireAuth, (req, res) => {
  res.json(toUserProfile(req.user!));
});

export default router;
