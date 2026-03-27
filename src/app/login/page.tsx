"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("vf_user", JSON.stringify(data.user));
      router.push("/app");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-12">
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
              <input
                name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-white/40 ml-1">Password</label>
                <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password" type={showPass ? "text" : "password"} autoComplete="current-password"
                  value={form.password} onChange={handleChange}
                  placeholder="Your password"
                  className="w-full px-4 py-3 pr-12 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all mt-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-400 hover:text-brand-300 transition-colors">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
