"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "AGENT") {
        router.replace("/admin");
        return;
      }

      setAuthorized(true);
    } catch {
      router.replace("/login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const linkStyle = (path: string) =>
    `block px-4 py-2 rounded-lg text-sm transition ${
      pathname === path
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  // ⛔ AUTH bo‘lmaguncha render qilmaymiz
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-slate-900 border-r border-slate-800
          p-6 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="font-semibold text-lg mb-8">
          Agent Panel
        </h2>

        <nav className="space-y-2">
          <Link href="/agent" className={linkStyle("/agent")}>
            Dashboard
          </Link>

          <Link href="/agent/categories" className={linkStyle("/agent/categories")}>
            Kategoriyalar
          </Link>

          <Link href="/agent/clients" className={linkStyle("/agent/clients")}>
            Mijozlar
          </Link>

          <Link href="/agent/cart" className={linkStyle("/agent/cart")}>
            Savatcha
          </Link>

          <Link href="/agent/orders" className={linkStyle("/agent/orders")}>
            Buyurtmalar
          </Link>

          <Link href="/agent/profile" className={linkStyle("/agent/profile")}>
            Profil
          </Link>
        </nav>

        <button
          onClick={logout}
          className="mt-10 text-sm text-red-400 hover:text-red-300"
        >
          Chiqish
        </button>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 sticky top-0 z-30">

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-slate-300 text-lg"
          >
            ☰
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={() => router.back()}
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Orqaga
          </button>
        </header>

        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
