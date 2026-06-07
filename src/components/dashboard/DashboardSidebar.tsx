import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Palette, Share2, CreditCard, Sparkles } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

const NAV = [
  { title: "Ma carte",     to: "/dashboard",          icon: LayoutGrid },
  { title: "Apparence",    to: "/dashboard/style",    icon: Palette },
  { title: "Partage & stats", to: "/dashboard/share", icon: Share2 },
  { title: "Plan & compte",   to: "/dashboard/account", icon: CreditCard },
] as const;

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (to: string) =>
    to === "/dashboard" ? pathname === "/dashboard" : pathname === to || pathname.startsWith(to + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <div className="h-8 w-8 rounded-lg grid place-items-center bg-primary text-primary-foreground shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Ma carte</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Dashboard</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <Link
            to="/builder"
            className="block text-xs text-center text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg py-2 transition"
          >
            ← Retour au builder
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
