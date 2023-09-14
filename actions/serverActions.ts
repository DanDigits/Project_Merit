"use server";
import { revalidateTag } from "next/cache";
import { Report } from "./../typings.d";

export const addReport = async (e: FormData) => {
  "use server";

  const email = e.get("email")?.toString();
  const title = e.get("title")?.toString();
  const quarter = e.get("quarter")?.toString();
  const date = e.get("date")?.toString();
  const report = e.get("report")?.toString();

  if (!email || !title || !quarter || !date || !report) return;

  const newReport: Report = {
    email,
    title,
    quarter,
    date,
    report,
  };

  await fetch(process.env.DB_URI, {
    method: "POST",
    body: JSON.stringify(newReport),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidateTag("reports");
};
