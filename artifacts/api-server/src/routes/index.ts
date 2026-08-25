import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import inquiriesRouter from "./inquiries";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertiesRouter);
router.use(inquiriesRouter);
router.use(storageRouter);

export default router;
