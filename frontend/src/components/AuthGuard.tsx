"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "ADMIN" | "AGENT";
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (role && payload.role !== role) {
        if (payload.role === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/agent");
        }
        return;
      }

      setReady(true);
    } catch {
      router.replace("/login");
    }
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return <>{children}</>;
}
