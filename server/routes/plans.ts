import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, plansTable } from "../db.js";

const router = Router();

function formatPlan(plan: typeof plansTable.$inferSelect) {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    priceMonthly: Number(plan.priceMonthly),
    priceYearly: Number(plan.priceYearly),
    ram: plan.ram,
    cpu: plan.cpu,
    storage: plan.storage,
    bandwidth: plan.bandwidth,
    features: plan.features as string[],
    highlighted: plan.highlighted,
    tier: plan.tier,
  };
}

router.get("/plans", async (_req, res): Promise<void> => {
  const plans = await db.select().from(plansTable).orderBy(plansTable.id);
  res.json(plans.map(formatPlan));
});

router.get("/plans/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid plan ID" }); return; }

  const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, id));
  if (!plan) { res.status(404).json({ error: "Plan not found" }); return; }

  res.json(formatPlan(plan));
});

export default router;
