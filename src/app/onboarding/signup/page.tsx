"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, AtSign, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - just navigate to home
    router.push("/home");
  };

  const isValid =
    form.name && form.username && form.email && form.password && form.agreeTerms;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-xl font-bold text-white">
          T
        </div>
        <h1 className="mb-2 text-2xl font-bold">Create Your Account</h1>
        <p className="mb-8 text-muted-foreground">
          Join the community and start connecting with your neighbors.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <label className="flex items-start gap-3 py-2">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded accent-indigo-500"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Create Account
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/home")}
          className="font-medium text-indigo-500 hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
