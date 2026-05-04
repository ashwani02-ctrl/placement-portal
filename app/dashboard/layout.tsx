// app/dashboard/layout.tsx
import DynamicBreadcrumb from "./components/dynamic-breadcrumb"
import AppSidebar from "@/app/dashboard/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />

          <DynamicBreadcrumb/>
        </header>

        <main className="p-6">
          {children} 
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}