"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[var(--color-ink)] items-center justify-center p-12">
        <div className="text-center text-white">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-6">Welcome back</p>
          <h1 className="font-script text-7xl text-white/90">Velvet</h1>
          <p className="mt-4 text-sm text-white/40 tracking-widest uppercase">
            Beautiful Wedding Websites
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <h1 className="font-script text-5xl">Velvet</h1>
          </div>

          <h2 className="font-display text-3xl font-light mb-2">Sign in</h2>
          <p className="text-sm text-[var(--color-muted)] mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-[var(--color-ink)]">
              Create one
            </Link>
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <Input
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[var(--color-ink)]/10" />
            <span className="text-xs text-[var(--color-muted)]">or</span>
            <div className="flex-1 h-px bg-[var(--color-ink)]/10" />
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
