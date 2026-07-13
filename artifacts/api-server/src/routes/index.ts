import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import domainRouter from "./domain";
import adminRouter from "./admin";
import integrationsRouter from "./integrations";
import staffPresentationUnlockRouter from "./staffPresentationUnlock";

const router: IRouter = Router();

router.use(healthRouter);
router.use(staffPresentationUnlockRouter);
router.use(authRouter);
router.use(domainRouter);
router.use(adminRouter);
router.use(integrationsRouter);

export default router;
