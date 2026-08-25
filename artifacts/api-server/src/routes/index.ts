import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertiesRouter from "./properties";
import inquiriesRouter from "./inquiries";
import storageRouter from "./storage";
import catalogRouter from "./catalog";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertiesRouter);
router.use(inquiriesRouter);
router.use(storageRouter);
router.use(catalogRouter);

export default router;
