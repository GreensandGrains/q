import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import plansRouter from "./routes/plans.js";
import ticketsRouter from "./routes/tickets.js";
import statsRouter from "./routes/stats.js";

const app = express();
app.use(express.json());

const basePath = (process.env.BASE_PATH || "/").replace(/\/$/, "") || "/";

const api = express.Router();
api.use(authRouter);
api.use(plansRouter);
api.use(ticketsRouter);
api.use(statsRouter);
api.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.use(`${basePath}/api`, api);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.join(__dirname, "..", "dist", "public");
  app.use(basePath === "/" ? "/" : basePath, express.static(publicDir));
  app.get(`${basePath === "/" ? "" : basePath}/*path`, (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Nexaro API running on http://localhost:${PORT}${basePath}`);
});
