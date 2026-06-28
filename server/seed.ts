import "dotenv/config";
import { db, plansTable } from "./db.js";

const plans = [
  {
    name: "Starter",
    description: "Perfect for hobby projects and early-stage apps.",
    priceMonthly: "4.99",
    priceYearly: "47.90",
    ram: "1 GB",
    cpu: "1 vCPU",
    storage: "25 GB SSD",
    bandwidth: "1 TB",
    features: ["1 Project", "Community Support", "Shared CPU", "Basic DDoS Protection", "99.9% Uptime SLA"],
    highlighted: false,
    tier: "starter",
  },
  {
    name: "Pro",
    description: "For growing teams that need reliability and speed.",
    priceMonthly: "14.99",
    priceYearly: "143.90",
    ram: "4 GB",
    cpu: "2 vCPU",
    storage: "80 GB NVMe",
    bandwidth: "5 TB",
    features: ["Unlimited Projects", "Priority Support", "Dedicated vCPU", "Advanced DDoS Protection", "99.97% Uptime SLA", "Custom Domain", "SSL Certificates"],
    highlighted: true,
    tier: "pro",
  },
  {
    name: "Business",
    description: "High-performance infrastructure for production workloads.",
    priceMonthly: "39.99",
    priceYearly: "383.90",
    ram: "16 GB",
    cpu: "4 vCPU",
    storage: "320 GB NVMe",
    bandwidth: "20 TB",
    features: ["Unlimited Projects", "24/7 Phone Support", "Dedicated CPU Cores", "Enterprise DDoS Protection", "99.99% Uptime SLA", "Custom Domains", "SSL + WAF", "Daily Backups", "Private Networking"],
    highlighted: false,
    tier: "business",
  },
  {
    name: "Enterprise",
    description: "Bespoke infrastructure for mission-critical applications.",
    priceMonthly: "99.99",
    priceYearly: "959.90",
    ram: "64 GB",
    cpu: "16 vCPU",
    storage: "1 TB NVMe",
    bandwidth: "Unlimited",
    features: ["Unlimited Everything", "Dedicated Account Manager", "Bare Metal Option", "Custom DDoS Mitigation", "99.999% Uptime SLA", "Custom Domains", "SSL + WAF + CDN", "Hourly Backups", "Private Networking", "SOC 2 Reports", "Custom SLA"],
    highlighted: false,
    tier: "enterprise",
  },
];

async function seed() {
  console.log("Seeding plans...");
  await db.insert(plansTable).values(plans).onConflictDoNothing();
  console.log("Done! 4 plans seeded.");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
