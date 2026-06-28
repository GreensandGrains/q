import { Router } from "express";

const router = Router();

router.get("/stats/overview", (_req, res) => {
  res.json({ activeUsers: 12847, plansSold: 8432, uptimePercent: 99.97, ticketsResolved: 3891 });
});

export default router;
