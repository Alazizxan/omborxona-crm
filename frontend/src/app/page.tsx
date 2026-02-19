"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/agent");
      }
    } catch (error) {
      router.replace("/login");
    }
  }, []);

  return null;
}
