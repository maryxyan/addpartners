import { Router, type IRouter } from "express";
import { CreateInquiryBody } from "@workspace/api-zod";
import { db, inquiriesTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/inquiries", async (req, res, next) => {
  try {
    const input = CreateInquiryBody.parse(req.body);
    const [inquiry] = await db
      .insert(inquiriesTable)
      .values(input)
      .returning();
    res.status(201).json(inquiry);
  } catch (error) {
    next(error);
  }
});

export default router;