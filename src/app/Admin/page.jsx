"use client";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (session?.user.role !== "Admin" && typeof window !== "undefined") {
    return window.location.assign("/Admin/Users");
  } else {
    if (typeof window !== "undefined") {
      window.location.assign("/Dashboard/Home");
    }
  }
}
