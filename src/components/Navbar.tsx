import { Link } from "wouter";
import { useGetMe, useLogout } from "@/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudLightning, LogOut, Ticket, Zap } from "lucide-react";

export function Navbar() {
  const { data: user, isLoading } = useGetMe({ query: { retry: false } });
  const logout = useLogout();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-[#050507]/60 border-b border-primary/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
          <CloudLightning className="w-8 h-8 text-primary animate-pulse" />
          <span className="font-bold text-xl tracking-wider">NEXARO</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/plans" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">Plans</Link>
          <a href="#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">About</a>
          <a href="#status" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-widest">Status</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-white uppercase tracking-wider text-xs">
              <Ticket className="w-4 h-4 mr-2" />Open Ticket
            </Button>
          </Link>

          {isLoading ? (
            <Skeleton className="h-9 w-24 bg-white/10" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 hidden sm:inline-block">{user.firstName} {user.lastName}</span>
              <Button variant="ghost" size="sm"
                onClick={() => logout.mutate(undefined, { onSuccess: () => { window.location.href = "/"; } })}
                className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] uppercase tracking-wider text-xs border border-primary/50">
                <Zap className="w-4 h-4 mr-2" />Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
