import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { requireAuth } from "../middlewares/auth";
import { loadDomainState } from "../services/domain-repository";
import { executeMutation } from "../services/domain-mutations";
import type { MutationRequest } from "../types/domain";

const router: IRouter = Router();

router.get("/domain", requireAuth, async (_req, res) => {
  const state = await loadDomainState();
  res.json(state);
});

const MutationBody = z.object({
  action: z.string(),
}).passthrough();

router.post("/domain/mutations", requireAuth, async (req, res) => {
  const parsed = MutationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid mutation" });
    return;
  }
  const mutation = parsed.data as MutationRequest;
  if (mutation.action === "approveClientUpdate" && !req.user!.role.match(/reviewer|admin/)) {
    res.status(403).json({ message: "Reviewer role required" });
    return;
  }
  const result = await executeMutation(mutation, req.user!.name);
  res.json(result);
});

router.get("/analytics", requireAuth, async (_req, res) => {
  const state = await loadDomainState();
  const openTasks = state.tasks.filter((t) => t.status !== "Done").length;
  const escalated = state.exams.filter((e) => e.status === "Escalated").length;
  const blocked = state.exams.filter((e) => e.applicationBlocked).length;
  res.json({ openTasks, escalated, blocked, totalExams: state.exams.length });
});

export default router;
