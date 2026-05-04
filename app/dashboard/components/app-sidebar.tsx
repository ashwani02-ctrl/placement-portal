"use client"
import React from "react"
import { useState } from "react"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/app/dashboard/components/search-form"
import { VersionSwitcher } from "@/app/dashboard/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export default function AppSidebar() {
  const [active, setActive] = useState<number | null>(null);

  const sidebarMenuItems = [
    {
      key: 1,
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      key: 2,
      name: "Company",
      url: "/dashboard/company",
    },
    {

      key: 3,
      name: "Course",
      url: "/dashboard/course",
    },
    {

      key: 4,
      name: "Job",
      url: "/dashboard/job",
    },
    {

      key: 5,
      name: "Student",
      url: "/dashboard/student",
    },
  ]
  const router = useRouter();
  const handleClick = (key: number, url: string) => {
    setActive(key);
    router.push(url);
  }

  const logout = async () => {
    await fetch(`/api/logout`, {
      method: "POST",
    });
    router.push("/login")
  }

  type MenuItems = {
    key: number
    name: string
    url: string
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h2>DASHBOARD</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarMenuItems.map((menu: MenuItems) => (
                <SidebarMenuItem key={menu.key}>
                  <SidebarMenuButton
                    isActive={active === menu.key}
                    onClick={() => handleClick(menu.key, menu.url)}
                    variant={"outline"}
                    className="justify-center"
                  >
                    {menu.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
        variant={"destructive"}
        onClick={logout}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )

}