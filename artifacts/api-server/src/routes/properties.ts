import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import {
  CreatePropertyBody,
  ListPropertiesQueryParams,
} from "@workspace/api-zod";
import { db, propertiesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/properties", async (req, res, next) => {
  try {
    const query = ListPropertiesQueryParams.parse(req.query);
    const filters = [
      query.category ? eq(propertiesTable.category, query.category) : undefined,
      query.zone ? eq(propertiesTable.zone, query.zone) : undefined,
      query.status ? eq(propertiesTable.status, query.status) : undefined,
      query.type ? eq(propertiesTable.type, query.type) : undefined,
    ].filter((filter): filter is NonNullable<typeof filter> => Boolean(filter));

    const rows = await db
      .select()
      .from(propertiesTable)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(propertiesTable.id);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/properties/:slug", async (req, res, next) => {
  try {
    const row = await db.query.propertiesTable.findFirst({
      where: eq(propertiesTable.slug, req.params.slug),
    });

    if (!row) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    res.json(row);
  } catch (error) {
    next(error);
  }
});

router.post("/properties", async (req, res, next) => {
  try {
    const input = CreatePropertyBody.parse(req.body);
    const [property] = await db
      .insert(propertiesTable)
      .values(input)
      .returning();
    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
});

export default router;