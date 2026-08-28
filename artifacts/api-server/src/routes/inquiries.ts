import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { CreateInquiryBody, DeleteInquiryParams, UpdateInquiryBody, UpdateInquiryParams } from "@workspace/api-zod";
import { db, inquiriesTable } from "@workspace/db";
import { requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();

router.get("/inquiries", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt)));
  } catch (error) {
    next(error);
  }
});

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

router.patch("/inquiries/:id", requireAdmin, async (req, res, next): Promise<void> => {
  try {
    const params = UpdateInquiryParams.parse(req.params);
    const input = UpdateInquiryBody.parse(req.body);
    const [inquiry] = await db.update(inquiriesTable).set(input).where(eq(inquiriesTable.id, params.id)).returning();
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }
    res.json(inquiry);
  } catch (error) {
    next(error);
  }
});

router.delete("/inquiries/:id", requireAdmin, async (req, res, next): Promise<void> => {
  try {
    const params = DeleteInquiryParams.parse(req.params);
    const [inquiry] = await db.delete(inquiriesTable).where(eq(inquiriesTable.id, params.id)).returning({ id: inquiriesTable.id });
    if (!inquiry) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
