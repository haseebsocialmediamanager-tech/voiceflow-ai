"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Mic, Lock, Check, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);
  const [form, setForm] = useState({ card: "", expiry: "", cvv: "", name: "" });

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const detectCard = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (num.startsWith("4")) setCardType("visa");
    else if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) setCardType("mastercard");
    else setCardType(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "card") {
      const formatted = formatCard(value);
      setForm({ ...form, card: formatted });
      detectCard(formatted);
    } else if (name === "expiry") {
      setForm({ ...form, expiry: formatExpiry(value) });
    } else if (name === "cvv") {
      setForm({ ...form, cvv: value.replace(/\D/g, "").slice(0, 4) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = form.card.replace(/\s/g, "");
    if (digits.length < 16) return;
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push("/app"), 2500);
  };

  const planDetails = plan === "pro"
    ? { name: "Pro Plan", price: "$12/month", trial: "7-day free trial", features: ["Unlimited dictation", "All 7 modes", "25+ languages", "Desktop app"] }
    : { name: "Lifetime Access", price: "$149 one-time", trial: "Pay once, own forever", features: ["Everything in Pro", "All future features", "Priority support"] };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center"
              style={{ boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
              <Mic size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">VoiceFlow AI</span>
          </Link>
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-8 text-center" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4"
              style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
              <Check size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Trial started!</h2>
            <p className="text-white/50 text-sm">Welcome to VoiceFlow Pro. Redirecting you now...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {/* Plan summary */}
            <div className="sm:col-span-2 glass rounded-3xl p-5" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="text-xs text-brand-400 font-semibold uppercase tracking-widest mb-3">Your Plan</div>
              <div className="font-bold text-lg mb-1">{planDetails.name}</div>
              <div className="text-2xl font-black gradient-text mb-1">{planDetails.price}</div>
              <div className="text-xs text-white/40 mb-5">{planDetails.trial}</div>
              <ul className="space-y-2">
                {planDetails.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                    <Check size={11} className="text-brand-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment form */}
            <div className="sm:col-span-3 glass rounded-3xl p-6" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-5">
                <Lock size={14} className="text-white/30" />
                <span className="text-sm font-semibold">Secure Payment</span>
                <div className="ml-auto flex items-center gap-2">
                  {/* Visa badge */}
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${cardType === "visa" ? "bg-blue-500/30 text-blue-300 border border-blue-500/30" : "bg-white/5 text-white/20"}`}>
                    VISA
                  </div>
                  {/* Mastercard badge */}
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${cardType === "mastercard" ? "bg-red-500/20 text-red-300 border border-red-500/20" : "bg-white/5 text-white/20"}`}>
                    MC
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Cardholder Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="Name on card" required
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Card Number</label>
                  <div className="relative">
                    <input name="card" type="text" value={form.card} onChange={handleChange}
                      placeholder="0000 0000 0000 0000" maxLength={19} required
                      className="w-full px-4 py-3 pr-12 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors font-mono tracking-wider"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <CreditCard size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 ml-1">Expiry Date</label>
                    <input name="expiry" type="text" value={form.expiry} onChange={handleChange}
                      placeholder="MM/YY" maxLength={5} required
                      className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors font-mono"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 ml-1">CVV / CVC</label>
                    <input name="cvv" type="password" value={form.cvv} onChange={handleChange}
                      placeholder="•••" maxLength={4} required
                      className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors font-mono"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-60 mt-2"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Lock size={14} /> Start 7-Day Free Trial <ArrowRight size={15} /></>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-white/20 mt-4 leading-relaxed">
                You won't be charged during the trial. Cancel anytime.
                <br />Secured by 256-bit SSL encryption.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
