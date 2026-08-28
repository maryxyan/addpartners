import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  CreateCatalogItemBody,
  CreateCatalogItemParams,
  DeleteCatalogItemParams,
  ListCatalogItemsParams,
  UpdateCatalogItemBody,
  UpdateCatalogItemParams,
} from "@workspace/api-zod";
import {
  db,
  propertyCategoriesTable,
  propertyStatusesTable,
} from "@workspace/db";
import { requireAdmin } from "../middleware/admin-auth";

const router: IRouter = Router();
const validKinds = ["categories", "statuses"] as const;
type CatalogKind = (typeof validKinds)[number];

function getKind(raw: unknown): CatalogKind | null {
  return validKinds.includes(raw as CatalogKind) ? raw as CatalogKind : null;
}

router.get("/catalog/:kind", async (req, res, next): Promise<void> => {
  try {
    const params = ListCatalogItemsParams.safeParse(req.params);
    const kind = getKind(params.success ? params.data.kind : null);
    if (!kind) {
      res.status(400).json({ error: "Catalog kind must be categories or statuses" });
      return;
    }
    const rows = kind === "categories"
      ? await db.select().from(propertyCategoriesTable).orderBy(propertyCategoriesTable.id)
      : await db.select().from(propertyStatusesTable).orderBy(propertyStatusesTable.id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/catalog/:kind", requireAdmin, async (req, res, next): Promise<void> => {
  try {
    const params = CreateCatalogItemParams.safeParse(req.params);
    const body = CreateCatalogItemBody.safeParse(req.body);
    const kind = getKind(params.success ? params.data.kind : null);
    if (!kind || !body.success) {
      res.status(400).json({ error: "Invalid catalog item" });
      return;
    }
    const [item] = kind === "categories"
      ? await db.insert(propertyCategoriesTable).values(body.data).returning()
      : await db.insert(propertyStatusesTable).values(body.data).returning();
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

router.patch("/catalog/:kind/:id", requireAdmin, async (req, res, next): Promise<void> => {
  try {
    const params = UpdateCatalogItemParams.safeParse(req.params);
    const body = UpdateCatalogItemBody.safeParse(req.body);
    const kind = getKind(params.success ? params.data.kind : null);
    if (!kind || !params.success || !body.success) {
      res.status(400).json({ error: "Invalid catalog item" });
      return;
    }
    const [item] = kind === "categories"
      ? await db.update(propertyCategoriesTable).set(body.data).where(eq(propertyCategoriesTable.id, params.data.id)).returning()
      : await db.update(propertyStatusesTable).set(body.data).where(eq(propertyStatusesTable.id, params.data.id)).returning();
    if (!item) {
      res.status(404).json({ error: "Catalog item not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.delete("/catalog/:kind/:id", requireAdmin, async (req, res, next): Promise<void> => {
  try {
    const params = DeleteCatalogItemParams.safeParse(req.params);
    const kind = getKind(params.success ? params.data.kind : null);
    if (!kind || !params.success) {
      res.status(400).json({ error: "Invalid catalog item" });
      return;
    }
    const [item] = kind === "categories"
      ? await db.delete(propertyCategoriesTable).where(eq(propertyCategoriesTable.id, params.data.id)).returning({ id: propertyCategoriesTable.id })
      : await db.delete(propertyStatusesTable).where(eq(propertyStatusesTable.id, params.data.id)).returning({ id: propertyStatusesTable.id });
    if (!item) {
      res.status(404).json({ error: "Catalog item not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
