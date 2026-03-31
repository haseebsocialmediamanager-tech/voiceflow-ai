"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Mic, Eye, EyeOff, ArrowRight, Check, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SignupPageContent() {
  const searchParams = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.includes("@")) return setError("Please enter a valid email.");
    if (form.phone.length < 7) return setError("Please enter a valid phone number.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);

    const { error: err } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          plan: "free",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${searchParams.get("next") || "/app"}`,
      },
    });

    setLoading(false);

    if (err) {
      if (err.message.includes("already registered")) {
        setError("An account with this email already exists. Sign in instead.");
      } else {
        setError(err.message);
      }
    } else {
      setDone(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-20%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
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

        <div className="glass rounded-3xl p-7 sm:p-8" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto mb-4"
                style={{ border: "1px solid rgba(99,102,241,0.3)" }}>
                <Mail size={28} className="text-brand-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your email</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                We sent a confirmation link to{" "}
                <span className="text-white/80">{form.email}</span>.
                <br />Click it to activate your account.
              </p>
              <p className="text-white/25 text-xs mt-4">Didn't get it? Check spam or{" "}
                <button onClick={() => setDone(false)} className="text-brand-400 hover:underline">try again</button>
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-7">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create your account</h1>
                <p className="text-white/40 text-sm">Free forever. No credit card required.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/20"
                  style={{ background: "rgba(239,68,68,0.08)" }}>
                  {error}
                  {error.includes("Sign in") && (
                    <Link href="/login" className="ml-1 text-brand-400 hover:underline">Sign in →</Link>
                  )}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Full Name</label>
                  <input name="name" type="text" autoComplete="name"
                    value={form.name} onChange={handleChange} placeholder="Muhammad Ali"
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    required />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Email Address</label>
                  <input name="email" type="email" autoComplete="email"
                    value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    required />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Phone Number</label>
                  <input name="phone" type="tel" autoComplete="tel"
                    value={form.phone} onChange={handleChange} placeholder="+92 300 0000000"
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    required />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input name="password" type={showPass ? "text" : "password"} autoComplete="new-password"
                      value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 pr-12 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all mt-2 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Check size={15} /> Create Free Account <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="text-center text-xs text-white/25 mt-6">
                Already have an account?{" "}
                <Link href={`/login${searchParams.get("next") ? `?next=${searchParams.get("next")}` : ""}`} className="text-brand-400 hover:text-brand-300 transition-colors">Sign in</Link>
              </p>
              <p className="text-center text-xs text-white/20 mt-3 leading-relaxed">
                By signing up you agree to our{" "}
                <Link href="/terms" className="hover:text-white/40 underline">Terms</Link> and{" "}
                <Link href="/privacy" className="hover:text-white/40 underline">Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupPageContent />
    </Suspense>
  );
}
