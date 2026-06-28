import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, sessionsTable } from "../db.js";
import { hashPassword, verifyPassword, generateToken } from "../auth.js";
import { z } from "zod";

const router = Router();
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

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    discordId: user.discordId ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request data" }); return; }

  const { firstName, lastName, email, password, agreedToTerms } = parsed.data;
  if (!agreedToTerms) { res.status(400).json({ error: "You must agree to the Terms of Service" }); return; }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) { res.status(409).json({ error: "An account with this email already exists" }); return; }

  const passwordHash = hashPassword(password);
  const [user] = await db.insert(usersTable).values({ firstName, lastName, email, passwordHash, agreedToTerms }).returning();

  const token = generateToken();
  await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_DURATION_MS) });

  res.status(201).json({ user: formatUser(user), token });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request data" }); return; }

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password" }); return;
  }

  const token = generateToken();
  await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_DURATION_MS) });

  res.json({ user: formatUser(user), token });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) { res.status(401).json({ error: "Not authenticated" }); return; }

  const token = authHeader.slice(7);
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, token));
  if (!session || session.expiresAt < new Date()) { res.status(401).json({ error: "Session expired or invalid" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId));
  if (!user) { res.status(401).json({ error: "User not found" }); return; }

  res.json(formatUser(user));
});

router.get("/auth/discord", async (_req, res): Promise<void> => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) { res.status(501).json({ error: "Discord OAuth not configured" }); return; }
  const redirectUri = encodeURIComponent(`${process.env.APP_URL || ""}/api/auth/discord/callback`);
  const scope = encodeURIComponent("identify email");
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`);
});

router.get("/auth/discord/callback", async (req, res): Promise<void> => {
  const { code } = req.query;
  if (!code || typeof code !== "string") { res.redirect("/?error=discord_auth_failed"); return; }

  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const appUrl = process.env.APP_URL || "";
    if (!clientId || !clientSecret) { res.redirect("/?error=discord_not_configured"); return; }

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "authorization_code", code, redirect_uri: `${appUrl}/api/auth/discord/callback` }),
    });
    const tokenData = await tokenRes.json() as { access_token: string };

    const userRes = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
    const discordUser = await userRes.json() as { id: string; email: string; username: string; global_name?: string };

    let [user] = await db.select().from(usersTable).where(eq(usersTable.discordId, discordUser.id));
    if (!user) {
      const [existingEmail] = await db.select().from(usersTable).where(eq(usersTable.email, discordUser.email));
      if (existingEmail) {
        await db.update(usersTable).set({ discordId: discordUser.id, discordAccessToken: tokenData.access_token }).where(eq(usersTable.id, existingEmail.id));
        user = { ...existingEmail, discordId: discordUser.id };
      } else {
        const displayName = discordUser.global_name || discordUser.username;
        const parts = displayName.split(" ");
        const [newUser] = await db.insert(usersTable).values({ email: discordUser.email, firstName: parts[0] || displayName, lastName: parts.slice(1).join(" ") || "User", discordId: discordUser.id, discordAccessToken: tokenData.access_token, agreedToTerms: true }).returning();
        user = newUser;
      }
    }

    const token = generateToken();
    await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt: new Date(Date.now() + SESSION_DURATION_MS) });
    res.redirect(`/?token=${token}`);
  } catch {
    res.redirect("/?error=discord_auth_failed");
  }
});

export default router;
