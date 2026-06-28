import { useState } from "react";
import { useListPlans } from "@/api";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star } from "lucide-react";
import { Link } from "wouter";

export default function Plans() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { data: plans, isLoading } = useListPlans();

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <Star className="w-3 h-3" /> Pricing Plans
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Orbit</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Transparent pricing with no hidden fees. Scale instantly as your mission grows.</p>

          <div className="inline-flex items-center gap-3 mt-8 p-1 rounded-full bg-white/5 border border-white/10">
            <button onClick={() => setBilling("monthly")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "text-gray-400 hover:text-white"}`}>Monthly</button>
            <button onClick={() => setBilling("yearly")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === "yearly" ? "bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]" : "text-gray-400 hover:text-white"}`}>
              Yearly <span className="ml-1 text-xs text-green-400 font-semibold">-20%</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="rounded-2xl bg-white/5 border border-white/10 h-96 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans?.map((plan) => (
              <div key={plan.id} className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] ${plan.highlighted ? "bg-primary/10 border-primary/60 shadow-[0_0_40px_rgba(124,58,237,0.3)]" : "bg-white/[0.03] border-white/10 hover:border-primary/30"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">${billing === "monthly" ? plan.priceMonthly.toFixed(2) : (plan.priceYearly / 12).toFixed(2)}</span>
                    <span className="text-gray-400 text-sm mb-1">/mo</span>
                  </div>
                  {billing === "yearly" && <p className="text-green-400 text-xs mt-1">${plan.priceYearly.toFixed(2)} billed yearly</p>}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-black/30 border border-white/5">
                  <div><div className="text-xs text-gray-500 uppercase tracking-wider">RAM</div><div className="text-white text-sm font-semibold">{plan.ram}</div></div>
                  <div><div className="text-xs text-gray-500 uppercase tracking-wider">CPU</div><div className="text-white text-sm font-semibold">{plan.cpu}</div></div>
                  <div><div className="text-xs text-gray-500 uppercase tracking-wider">Storage</div><div className="text-white text-sm font-semibold">{plan.storage}</div></div>
                  <div><div className="text-xs text-gray-500 uppercase tracking-wider">Bandwidth</div><div className="text-white text-sm font-semibold">{plan.bandwidth}</div></div>
                </div>
                <ul className="space-y-2 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className={`w-full uppercase tracking-wider text-sm ${plan.highlighted ? "bg-primary hover:bg-primary/80 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]" : "bg-white/10 hover:bg-white/20 text-white border border-white/20"}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 p-10 text-center">
          <h3 className="text-white text-2xl font-bold mb-3">Need a Custom Solution?</h3>
          <p className="text-gray-400 mb-6">Enterprise-grade infrastructure tailored exactly to your requirements. Dedicated support and custom SLAs included.</p>
          <Link href="/tickets">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 uppercase tracking-wider">Contact Our Team</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
