import type { NextFunction, Request, Response } from "express";
import type { User } from "@workspace/db";
import { getUserForToken } from "../lib/auth";
import { hasPermission } from "../lib/permissions";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      sessionToken?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  const cookieToken = req.cookies?.exammanageros_token as string | undefined;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : cookieToken ?? null;
  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await getUserForToken(token);
  if (!user) {
    res.status(401).json({ message: "Session expired or invalid" });
    return;
  }
  req.user = user;
  req.sessionToken = token;
  next();
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !hasPermission(user.role, permission)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}
