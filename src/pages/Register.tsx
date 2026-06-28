import { useState } from "react";
import { useRegister } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudLightning, Mail, Lock, User, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

const DiscordIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 71 55" fill="#5865F2">
    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.401329 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7637 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
  </svg>
);

export default function Register() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", agreedToTerms: false });
  const [error, setError] = useState("");
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.agreedToTerms) { setError("You must agree to the Terms of Service and Privacy Policy."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters long."); return; }
    register.mutate(
      { data: { ...form } },
      {
        onSuccess: (data) => { localStorage.setItem("nexaro_token", data.token); navigate("/"); window.location.reload(); },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { error?: string } } };
          setError(e?.response?.data?.error || "Registration failed. Please try again.");
        },
      }
    );
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="fixed top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl bg-[#0D0D14]/80 backdrop-blur-xl border border-primary/20 shadow-[0_0_60px_rgba(124,58,237,0.15)] p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white">
              <CloudLightning className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl tracking-wider">NEXARO CLOUD</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4">Begin Your Journey</h1>
            <p className="text-gray-400 text-sm mt-1">Create your account and deploy in minutes</p>
          </div>

          <a href="/api/auth/discord">
            <Button variant="outline" className="w-full mb-6 border-[#5865F2]/50 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-white hover:text-white h-12">
              <DiscordIcon /> Register with Discord
            </Button>
          </a>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0D0D14] text-gray-500 uppercase tracking-widest">or register with email</span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-widest">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input placeholder="John" value={form.firstName} onChange={set("firstName")} required className="pl-9 bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-widest">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input placeholder="Doe" value={form.lastName} onChange={set("lastName")} required className="pl-9 bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs uppercase tracking-widest">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input type="email" placeholder="pilot@nexaro.cloud" value={form.email} onChange={set("email")} required className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs uppercase tracking-widest">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input type="password" placeholder="Min. 8 characters" value={form.password} onChange={set("password")} required className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
              </div>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <Checkbox id="terms" checked={form.agreedToTerms} onCheckedChange={(v) => setForm((f) => ({ ...f, agreedToTerms: Boolean(v) }))} className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
              <Label htmlFor="terms" className="text-sm text-gray-400 leading-snug cursor-pointer">
                I agree to Nexaro Cloud's{" "}
                <Link href="/terms" className="text-primary hover:text-accent">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary hover:text-accent">Privacy Policy</Link>
              </Label>
            </div>
            <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/80 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] uppercase tracking-wider mt-2" disabled={register.isPending}>
              {register.isPending ? "Creating Account..." : "Launch Into Orbit"}
            </Button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-accent transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
