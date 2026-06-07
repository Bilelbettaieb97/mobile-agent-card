import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ma carte digitale" },
      { name: "description", content: "Personnalisez, partagez et suivez votre carte de visite digitale." },
    ],
  }),
  component: DashboardLayout,
});

const TITLES: Record<string, string> = {
  "/dashboard": "Ma carte",
  "/dashboard/style": "Apparence & style",
  "/dashboard/share": "Partage & statistiques",
  "/dashboard/account": "Plan & compte",
};

function DashboardLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <DashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-background px-4 sticky top-0 z-30">
            <SidebarTrigger className="-ml-1" />
            <div className="h-5 w-px bg-border" aria-hidden />
            <h1 className="font-display text-base sm:text-lg font-medium truncate">{title}</h1>
          </header>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
