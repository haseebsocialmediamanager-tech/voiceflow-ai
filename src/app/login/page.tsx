"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Eye, EyeOff, ArrowRight, X, Mail, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─── Forgot Password Modal ─────────────────────────────────────
function ForgotModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email.");
    setLoading(true);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm glass rounded-3xl p-7"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose}
            className="absolute right-5 top-5 p-1.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors">
            <X size={16} />
          </button>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4"
                style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
                <Check size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email sent!</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Check your inbox at <span className="text-white/80">{email}</span> for a password reset link.
                It expires in 1 hour.
              </p>
              <p className="text-white/25 text-xs mt-3">Check spam if you don't see it.</p>
              <button onClick={onClose}
                className="mt-5 w-full py-3 rounded-2xl text-sm font-semibold text-white/60 glass hover:bg-white/5 transition-colors">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/15 flex items-center justify-center flex-shrink-0"
                  style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
                  <Mail size={18} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Reset password</h3>
                  <p className="text-white/40 text-xs">We&apos;ll email you a reset link instantly</p>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/20"
                  style={{ background: "rgba(239,68,68,0.08)" }}>
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Email Address</label>
                  <input type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    required />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <>Send Reset Link <ArrowRight size={15} /></>}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Login Page ────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@")) return setError("Please enter a valid email.");
    if (!form.password) return setError("Please enter your password.");

    setLoading(true);

    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    setLoading(false);

    if (err) {
      if (err.message.includes("Invalid login")) {
        setError("Incorrect email or password.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Please confirm your email first — check your inbox.");
      } else {
        setError(err.message);
      }
    } else {
      router.push("/app");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-12">
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}

      <div className="fixed top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
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
          <div className="text-center mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-white/40 text-sm">Sign in to your account</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/20"
              style={{ background: "rgba(239,68,68,0.08)" }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 ml-1">Email Address</label>
              <input name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-white/40 ml-1">Password</label>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input name="password" type={showPass ? "text" : "password"} autoComplete="current-password"
                  value={form.password} onChange={handleChange} placeholder="Your password"
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
                : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-400 hover:text-brand-300 transition-colors">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
