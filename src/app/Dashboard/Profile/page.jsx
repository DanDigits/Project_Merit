"use client";
import { useState } from "react";
import UserProfile from "./UserProfile";

export default function Page() {
  const [mode, setMode] = useState("View");

  return (
    <>
      {mode === "View" && (
        <>
          <UserProfile />
        </>
      )}
    </>
  );
}
