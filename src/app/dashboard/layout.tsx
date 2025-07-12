// app/dashboard/layout.tsx
"use client";
import { ReactNode } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <RouteGuard>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </RouteGuard>
    </AuthProvider>
  );
}