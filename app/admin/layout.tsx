import { ReactNode } from "react";
import { AdminLayout as AdminLayoutComponent } from "@/src/components/admin/AdminLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}

