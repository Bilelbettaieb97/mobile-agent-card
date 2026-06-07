import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid, CreditCard, Palette, BarChart3, User, Sparkles,
  Users, Settings, Zap, Crown,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useCardStore } from "@/lib/card-store";
import { getCompletion } from "@/lib/card-completion";
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

const PRIMARY = [
  { title: "Vue d'ensemble", to: "/dashboard",         icon: LayoutGrid },
  { title: "Ma carte",       to: "/dashboard/card",    icon: CreditCard },
  { title: "Apparence",      to: "/dashboard/style",   icon: Palette },
  { title: "Statistiques",   to: "/dashboard/share",   icon: BarChart3 },
] as const;

const SECONDARY = [
  { title: "Contacts",       to: "/dashboard/contacts", icon: Users,    soon: true },
  { title: "Paramètres",     to: "/dashboard/settings", icon: Settings, soon: true },
  { title: "Plan & compte",  to: "/dashboard/account",  icon: User },
] as const;

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { data, hydrated } = useCardStore();
  const { score } = hydrated ? getCompletion(data) : { score: 0 };

  const isActive = (to: string) =>
    to === "/dashboard" ? pathname === "/dashboard" : pathname === to || pathname.startsWith(to + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="h-9 w-9 rounded-xl grid place-items-center bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shrink-0 shadow-[0_4px_20px_-4px] shadow-primary/50">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <div className="text-sm font-semibold truncate">Ma carte</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Studio Pro</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Pilotage</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                    <Link to={item.to} className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Espace</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild={!item.soon}
                    isActive={isActive(item.to)}
                    tooltip={item.title + (item.soon ? " (bientôt)" : "")}
                    className={item.soon ? "opacity-60 cursor-not-allowed" : undefined}
                  >
                    {item.soon ? (
                      <div className="flex items-center gap-2.5 w-full">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span>{item.title}</span>
                            <span className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Bientôt</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <Link to={item.to} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Completion widget */}
        {!collapsed && hydrated && (
          <div className="mx-3 mt-3 p-3 rounded-xl border border-border bg-card/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Complétion</span>
              <span className="text-sm font-display font-medium text-primary">{score}%</span>
            </div>
            <Progress value={score} className="h-1.5" />
            <p className="text-[10.5px] text-muted-foreground mt-2 leading-snug">
              {score >= 100 ? "Carte 100% optimisée 🎉" : score >= 75 ? "Presque parfaite — quelques détails." : "Complétez votre carte pour maximiser la conversion."}
            </p>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="gap-2">
        {/* Trial / upgrade card */}
        {!collapsed && (
          <Link
            to="/dashboard/account"
            className="block rounded-xl p-3 border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent hover:border-primary/50 transition group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] uppercase tracking-wider font-medium">Essai · J-7</span>
            </div>
            <p className="text-[11.5px] text-muted-foreground leading-snug mb-2">
              Plan <span className="text-foreground font-medium">Vitrine</span> actif jusqu'au 14 juin.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary group-hover:gap-1.5 transition-all">
              <Zap className="h-3 w-3" /> Voir mon plan →
            </span>
          </Link>
        )}

        {/* User chip */}
        <div className={`flex items-center gap-2 rounded-xl p-2 border border-border bg-card/30 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground text-xs font-semibold shrink-0">
            {(data.name || "M").charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-medium truncate">{data.name || "Mon compte"}</div>
              <div className="text-[10px] text-muted-foreground truncate">Mode prévisualisation</div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
