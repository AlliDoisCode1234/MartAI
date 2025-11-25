import { ReactNode } from "react";
import { AdminGuard } from "@/src/components/admin/AdminGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}

