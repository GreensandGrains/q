import { useGetOverview, getGetOverviewQueryKey } from "@/api";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Server, Shield, Zap, Cpu, HardDrive, Globe } from "lucide-react";

export default function Home() {
  const { data: stats } = useGetOverview({ query: { queryKey: getGetOverviewQueryKey() } });

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4" /> The AWS of the Future
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Power The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Cosmos</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Deploy high-performance infrastructure in seconds. Experience uncompromised speed, military-grade security, and a beautiful developer experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] text-lg h-14 px-8 uppercase tracking-widest">
                Start Deploying <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/plans">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 h-14 px-8 uppercase tracking-widest bg-transparent">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-white/5 bg-[#0D0D14]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stats?.activeUsers ? (stats.activeUsers / 1000).toFixed(1) + "k+" : "10k+"}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Developers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stats?.uptimePercent ?? "99.99"}%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Guaranteed Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stats?.plansSold ? (stats.plansSold / 1000).toFixed(1) + "k+" : "50k+"}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Instances Deployed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stats?.ticketsResolved ? (stats.ticketsResolved / 1000).toFixed(1) + "k+" : "100k+"}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Support Tickets Resolved</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Engineered for Excellence</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We've built a cloud platform that doesn't compromise. Get the power you need with the aesthetics you deserve.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "Next-Gen Compute", desc: "Powered by the latest AMD EPYC and Intel Xeon processors for unmatched performance." },
              { icon: HardDrive, title: "NVMe SSD Storage", desc: "Blazing fast storage with up to 100k IOPS for your most demanding applications." },
              { icon: Globe, title: "Global Network", desc: "Deploy your applications close to your users with our ultra-low latency global edge network." },
              { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade mitigation systems keep your infrastructure online during attacks." },
              { icon: Server, title: "Instant Provisioning", desc: "Your instances are ready in less than 30 seconds. Stop waiting, start building." },
              { icon: Zap, title: "Simple API", desc: "Automate your infrastructure with our beautiful, intuitive REST API." },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-[#0D0D14]/80 border border-white/5 hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to explore?</h2>
          <p className="text-xl text-gray-300 mb-10">Join thousands of developers building the future on Nexaro Cloud.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-16 px-10 text-lg uppercase tracking-widest font-bold">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
