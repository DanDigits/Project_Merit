"use client";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  if (session?.user.role === "Admin") {
    return window.location.assign("/Admin/Users");
  }

  return window.location.assign("/Dashboard/Home");
}
