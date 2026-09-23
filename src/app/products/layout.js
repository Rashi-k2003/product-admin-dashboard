"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/services/auth";

export default function ProductsLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null; // avoid flashing protected content before the check runs

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <h1 className="font-semibold">Product Admin</h1>
        <button onClick={handleLogout} className="text-sm text-red-600">
          Logout
        </button>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}