import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import plansRouter from "./routes/plans.js";
import ticketsRouter from "./routes/tickets.js";
import statsRouter from "./routes/stats.js";

const app = express();
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", plansRouter);
app.use("/api", ticketsRouter);
app.use("/api", statsRouter);

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.join(__dirname, "public");
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Nexaro API running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    console.log(`Frontend served from http://localhost:${PORT}`);
  }
});
