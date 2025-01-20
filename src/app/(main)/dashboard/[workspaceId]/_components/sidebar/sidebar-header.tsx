"use client";

import {
  SidebarHeader as AppSidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Logo from "@/icons/logo";

export default function SidebarHeader() {
  return (
    <AppSidebarHeader className="mb-3">
      <SidebarMenu className="py-4 px-1">
        <div className="w-full flex justify-center items-center">
          <Logo />
        </div>
      </SidebarMenu>
    </AppSidebarHeader>
  );
}
