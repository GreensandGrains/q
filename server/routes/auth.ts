import { Router } from "express";
import { hashPassword, verifyPassword, generateToken } from "../auth.js";
import { z } from "zod";

const router = Router();

interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  discordId: string | null;
  agreedToTerms: boolean;
  createdAt: Date;
}

interface Session {
  userId: number;
  token: string;
  expiresAt: Date;
}

const users = new Map<number, User>();
const sessions = new Map<string, Session>();
let nextId = 1;

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

const RegisterBody = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  agreedToTerms: z.boolean(),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function formatUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    discordId: user.discordId,
    createdAt: user.createdAt.toISOString(),
  };
}

function getUserByEmail(email: string) {
  return Array.from(users.values()).find((u) => u.email === email);
}

function getSessionUser(authHeader: string | undefined): User | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const session = sessions.get(token);
  if (!session || session.expiresAt < new Date()) return null;
  return users.get(session.userId) || null;
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request data" }); return; }
  const { firstName, lastName, email, password, agreedToTerms } = parsed.data;
  if (!agreedToTerms) { res.status(400).json({ error: "You must agree to the Terms of Service" }); return; }
  if (getUserByEmail(email)) { res.status(409).json({ error: "An account with this email already exists" }); return; }

  const user: User = { id: nextId++, email, passwordHash: hashPassword(password), firstName, lastName, discordId: null, agreedToTerms, createdAt: new Date() };
  users.set(user.id, user);

  const token = generateToken();
  sessions.set(token, { userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_DURATION_MS) });
  res.status(201).json({ user: formatUser(user), token });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request data" }); return; }
  const { email, password } = parsed.data;
  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) { res.status(401).json({ error: "Invalid email or password" }); return; }

  const token = generateToken();
  sessions.set(token, { userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_DURATION_MS) });
  res.json({ user: formatUser(user), token });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) sessions.delete(authHeader.slice(7));
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const user = getSessionUser(req.headers.authorization);
  if (!user) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json(formatUser(user));
});

export { getSessionUser };
export default router;
