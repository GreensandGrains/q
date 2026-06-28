import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, ticketsTable, sessionsTable, usersTable } from "../db.js";
import { z } from "zod";

const router = Router();

const CreateTicketBody = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
});

async function getAuthUser(authHeader: string | undefined) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, token));
  if (!session || session.expiresAt < new Date()) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId));
  return user || null;
}

function formatTicket(ticket: typeof ticketsTable.$inferSelect) {
  return {
    id: ticket.id,
    userId: ticket.userId,
    subject: ticket.subject,
    message: ticket.message,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

router.get("/tickets", async (req, res): Promise<void> => {
  const user = await getAuthUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const tickets = await db.select().from(ticketsTable).where(eq(ticketsTable.userId, user.id)).orderBy(ticketsTable.createdAt);
  res.json(tickets.map(formatTicket));
});

router.post("/tickets", async (req, res): Promise<void> => {
  const user = await getAuthUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request data" }); return; }

  const [ticket] = await db.insert(ticketsTable).values({
    userId: user.id,
    subject: parsed.data.subject,
    message: parsed.data.message,
    priority: parsed.data.priority,
    status: "open",
  }).returning();

  res.status(201).json(formatTicket(ticket));
});

router.get("/tickets/:id", async (req, res): Promise<void> => {
  const user = await getAuthUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ticket ID" }); return; }

  const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
  if (!ticket || ticket.userId !== user.id) { res.status(404).json({ error: "Ticket not found" }); return; }

  res.json(formatTicket(ticket));
});

export default router;
