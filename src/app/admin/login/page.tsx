"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const search = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Нэвтрэхэд алдаа гарлаа");
      }
      const to = search.get("from") || "/admin";
      router.replace(to);
    } catch (e: any) {
      setError(e?.message || "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Админ нэвтрэх</h1>
        <p className="text-gray-600 mb-6">
          Админ хуудсанд нэвтрэхийн тулд имэйл болон нууц үгээ оруулна уу.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Имэйл
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Нууц үг
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-60"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </div>
    </div>
  );
}
