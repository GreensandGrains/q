import { Router } from "express";
import { getSessionUser } from "./auth.js";
import { z } from "zod";

const router = Router();

interface Ticket {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

const tickets = new Map<number, Ticket>();
let nextId = 1;

const CreateTicketBody = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
});

function formatTicket(t: Ticket) {
  return { ...t, createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString() };
}

router.get("/tickets", (req, res): void => {
  const user = getSessionUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
  const userTickets = Array.from(tickets.values()).filter((t) => t.userId === user.id);
  res.json(userTickets.map(formatTicket));
});

router.post("/tickets", (req, res): void => {
  const user = getSessionUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
  const parsed = CreateTicketBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request data" }); return; }
  const now = new Date();
  const ticket: Ticket = { id: nextId++, userId: user.id, subject: parsed.data.subject, message: parsed.data.message, status: "open", priority: parsed.data.priority, createdAt: now, updatedAt: now };
  tickets.set(ticket.id, ticket);
  res.status(201).json(formatTicket(ticket));
});

router.get("/tickets/:id", (req, res): void => {
  const user = getSessionUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
  const ticket = tickets.get(parseInt(req.params.id, 10));
  if (!ticket || ticket.userId !== user.id) { res.status(404).json({ error: "Ticket not found" }); return; }
  res.json(formatTicket(ticket));
});

export default router;
