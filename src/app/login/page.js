"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, saveToken } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return; // stops rapid double-clicks from firing multiple requests
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(username, password);
      saveToken(data.token);
      router.push("/products");
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <label className="block text-sm mb-1">Username</label>
        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Use: emilys / emilyspass
        </p>
      </form>
    </div>
  );
}