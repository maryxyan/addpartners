import { Router, type IRouter } from "express";
import { createAdminToken, isAdminPassword, requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const loginWindowMs = 15 * 60 * 1000;
const maximumLoginAttempts = 10;

router.post("/auth/login", (req, res) => {
  const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  const current = loginAttempts.get(key);
  const attempts = !current || current.resetAt <= now ? { count: 0, resetAt: now + loginWindowMs } : current;

  if (attempts.count >= maximumLoginAttempts) {
    res.setHeader("Retry-After", Math.ceil((attempts.resetAt - now) / 1000));
    res.status(429).json({ error: "Too many login attempts" });
    return;
  }

  if (!isAdminPassword(req.body?.password)) {
    attempts.count += 1;
    loginAttempts.set(key, attempts);
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  loginAttempts.delete(key);
  res.json({ token: createAdminToken() });
});

router.get("/auth/session", requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});

export default router;
