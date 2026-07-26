// SERVER COMPONENT — do NOT add "use client" here.
// Defence-in-depth: server-side session check guards this page even if
// middleware is bypassed.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUploadClient from "./AdminUploadClient";

export default async function AdminUploadPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <AdminUploadClient />;
}