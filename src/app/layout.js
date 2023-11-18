"use client";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <SessionProvider>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
}
