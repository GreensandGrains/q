import { useState } from "react";
import { useListTickets, useCreateTicket, getListTicketsQueryKey } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, Plus, Clock, CheckCircle, AlertTriangle, X } from "lucide-react";
import { Link } from "wouter";

const statusIcon: Record<string, React.ReactNode> = {
  open: <Clock className="w-4 h-4 text-yellow-400" />,
  in_progress: <AlertTriangle className="w-4 h-4 text-blue-400" />,
  resolved: <CheckCircle className="w-4 h-4 text-green-400" />,
  closed: <X className="w-4 h-4 text-gray-400" />,
};

const priorityColor: Record<string, string> = {
  low: "text-green-400 bg-green-400/10 border-green-400/30",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  critical: "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function Tickets() {
  const queryClient = useQueryClient();
  const { data: tickets, isLoading, error } = useListTickets();
  const createTicket = useCreateTicket();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [formError, setFormError] = useState("");

  const isUnauth = (error as { response?: { status?: number } })?.response?.status === 401;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    createTicket.mutate(
      { data: form },
      {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTicketsQueryKey() }); setShowForm(false); setForm({ subject: "", message: "", priority: "medium" }); },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { error?: string }; status?: number } };
          setFormError(e?.response?.status === 401 ? "Please log in to submit a ticket." : (e?.response?.data?.error || "Failed to submit ticket."));
        },
      }
    );
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              <Ticket className="w-3 h-3" /> Support Center
            </div>
            <h1 className="text-4xl font-bold text-white">My Tickets</h1>
            <p className="text-gray-400 mt-1">Our team responds within 24 hours on all plans.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] uppercase tracking-wider">
            <Plus className="w-4 h-4 mr-2" /> New Ticket
          </Button>
        </div>

        {showForm && (
          <div className="rounded-2xl bg-[#0D0D14]/80 backdrop-blur-xl border border-primary/30 shadow-[0_0_40px_rgba(124,58,237,0.15)] p-6 mb-8">
            <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Open New Ticket</h3>
            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
                {formError} {formError.includes("log in") && <Link href="/login" className="underline hover:text-red-300">Sign in here</Link>}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-widest">Subject</Label>
                <Input placeholder="Briefly describe your issue..." value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required className="bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-widest">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                  <SelectTrigger className="bg-black/30 border-white/10 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0D0D14] border-white/10">
                    <SelectItem value="low" className="text-white">Low</SelectItem>
                    <SelectItem value="medium" className="text-white">Medium</SelectItem>
                    <SelectItem value="high" className="text-white">High</SelectItem>
                    <SelectItem value="critical" className="text-white">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-widest">Message</Label>
                <Textarea placeholder="Describe the issue in detail..." value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required rows={4} className="bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 resize-none" />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={createTicket.isPending} className="bg-primary hover:bg-primary/80 text-white uppercase tracking-wider">
                  {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {isUnauth ? (
          <div className="rounded-2xl bg-[#0D0D14]/80 backdrop-blur-xl border border-primary/20 p-12 text-center">
            <Ticket className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Sign in to view your tickets</h3>
            <p className="text-gray-400 mb-6">Track your support requests and get real-time updates.</p>
            <Link href="/login"><Button className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]">Sign In</Button></Link>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="rounded-xl bg-white/5 border border-white/10 h-20 animate-pulse" />)}
          </div>
        ) : tickets && tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-xl bg-[#0D0D14]/60 border border-white/10 hover:border-primary/30 p-5 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5">{statusIcon[ticket.status] || statusIcon.open}</div>
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold truncate">{ticket.subject}</h4>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{ticket.message}</p>
                      <p className="text-gray-600 text-xs mt-2">{new Date(ticket.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold capitalize ${priorityColor[ticket.priority] || priorityColor.medium}`}>{ticket.priority}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs capitalize">{ticket.status.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#0D0D14]/80 backdrop-blur-xl border border-primary/20 p-12 text-center">
            <Ticket className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No tickets yet</h3>
            <p className="text-gray-400 mb-6">Create your first support ticket and our team will get right on it.</p>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <Plus className="w-4 h-4 mr-2" /> Open First Ticket
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
