"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "names">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleNamesChange(bride: string, groom: string) {
    setBrideName(bride);
    setGroomName(groom);
    if (bride && groom) {
      setSlug(slugify(`${bride}-and-${groom}`));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === "credentials") {
      setStep("names");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, slug, brideName, groomName }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Sign up failed");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/setup");
    router.refresh();
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
      <div className="hidden lg:flex w-1/2 bg-[var(--color-ink)] items-center justify-center p-12">
        <div className="text-center text-white">
          <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-6">Get started</p>
          <h1 className="font-script text-7xl text-white/90">Velvet</h1>
          <p className="mt-4 text-sm text-white/40 tracking-widest uppercase">
            Your story. Your website.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <h1 className="font-script text-5xl">Velvet</h1>
          </div>

          <h2 className="font-display text-3xl font-light mb-2">
            {step === "credentials" ? "Create account" : "Your wedding details"}
          </h2>
          <p className="text-sm text-[var(--color-muted)] mb-8">
            {step === "credentials" ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="underline text-[var(--color-ink)]">Sign in</Link>
              </>
            ) : (
              "These will personalise your wedding website."
            )}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {step === "credentials" ? (
              <>
                <Input
                  id="email"
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button type="submit" className="w-full mt-2">Continue</Button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-[var(--color-ink)]/10" />
                  <span className="text-xs text-[var(--color-muted)]">or</span>
                  <div className="flex-1 h-px bg-[var(--color-ink)]/10" />
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
                  Continue with Google
                </Button>
              </>
            ) : (
              <>
                <Input
                  id="bride"
                  label="Bride's name"
                  value={brideName}
                  onChange={(e) => handleNamesChange(e.target.value, groomName)}
                  placeholder="e.g. Sharon"
                  required
                />
                <Input
                  id="groom"
                  label="Groom's name"
                  value={groomName}
                  onChange={(e) => handleNamesChange(brideName, e.target.value)}
                  placeholder="e.g. Victor"
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <Input
                    id="slug"
                    label="Your website URL"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    required
                  />
                  <p className="text-xs text-[var(--color-muted)]">
                    velvet.com/<span className="text-[var(--color-ink)]">{slug || "your-url"}</span>
                  </p>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? "Creating your site…" : "Create my wedding site"}
                </Button>
                <button
                  type="button"
                  className="text-xs text-[var(--color-muted)] underline"
                  onClick={() => setStep("credentials")}
                >
                  Back
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
