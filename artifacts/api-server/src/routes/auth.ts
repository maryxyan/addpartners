import { Router, type IRouter } from "express";
import { createAdminToken, isAdminPassword, requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();

router.post("/auth/login", (req, res) => {
  if (!isAdminPassword(req.body?.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  res.json({ token: createAdminToken() });
});

router.get("/auth/session", requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});

export default router;
