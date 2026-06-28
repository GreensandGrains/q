import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CloudLightning } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <CloudLightning className="w-16 h-16 text-primary/40 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">This page doesn't exist in our galaxy.</p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/80 text-white uppercase tracking-wider">Return to Home</Button>
        </Link>
      </div>
    </div>
  );
}
