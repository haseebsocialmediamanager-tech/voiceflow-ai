"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  // Supabase puts the recovery token in the URL hash.
  // We listen for the session to be set from that token.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/app"), 2000);
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
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4"
                style={{ border: "1px solid rgba(16,185,129,0.3)" }}>
                <Check size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password updated!</h2>
              <p className="text-white/50 text-sm">Redirecting you to the app...</p>
            </motion.div>
          ) : !ready ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4"
                style={{ border: "1px solid rgba(245,158,11,0.2)" }}>
                <AlertCircle size={24} className="text-amber-400" />
              </div>
              <h2 className="text-lg font-bold mb-2">Waiting for link...</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                This page needs to be opened from the password reset email link.
                If you came here directly, go back and click the link in your email.
              </p>
              <Link href="/login"
                className="inline-block mt-5 text-sm text-brand-400 hover:text-brand-300 transition-colors">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold mb-2">Set new password</h1>
                <p className="text-white/40 text-sm">Choose a strong password for your account.</p>
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
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">New Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Min. 6 characters"
                      className="w-full px-4 py-3 pr-12 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5 ml-1">Confirm Password</label>
                  <input type="password" value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    placeholder="Repeat your password"
                    className="w-full px-4 py-3 rounded-2xl text-sm text-white placeholder-white/20 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    required />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all mt-2 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 30px rgba(99,102,241,0.35)" }}>
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Check size={15} /> Update Password</>}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
