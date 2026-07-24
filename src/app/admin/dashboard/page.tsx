import Dashboard from "@/featured/admin/Dashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard");
  }
  return <Dashboard />;
}

