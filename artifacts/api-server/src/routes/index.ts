import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import inquiriesRouter from "./inquiries";
import storageRouter from "./storage";
import catalogRouter from "./catalog";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(propertiesRouter);
router.use(inquiriesRouter);
router.use(storageRouter);
router.use(catalogRouter);

export default router;
