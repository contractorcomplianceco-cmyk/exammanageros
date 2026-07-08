import { Router, type IRouter } from "express";
import { getIntegrationStatus } from "../lib/integrations";
import { requireAuth, requirePermission } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/integrations/status", requireAuth, requirePermission("integrations:manage"), (_req, res) => {
  res.json(getIntegrationStatus());
});

export default router;
