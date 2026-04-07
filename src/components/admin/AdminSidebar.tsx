import {
  LayoutDashboard, Users, CreditCard, Landmark, BookOpen, FileQuestion,
  MessageSquare, FileBarChart, Activity, Settings, Shield
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Alunos", url: "/admin/students", icon: Users },
  { title: "Assinaturas", url: "/admin/subscriptions", icon: CreditCard },
  { title: "Concursos", url: "/admin/contests", icon: Landmark },
  { title: "Materiais", url: "/admin/materials", icon: BookOpen },
  { title: "Questões", url: "/admin/questions", icon: FileQuestion },
  { title: "Feedbacks", url: "/admin/feedback", icon: MessageSquare },
  { title: "Relatórios", url: "/admin/reports", icon: FileBarChart },
  { title: "Monitoramento", url: "/admin/monitoring", icon: Activity },
  { title: "Configurações", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {!collapsed && <span className="font-bold text-primary">Admin</span>}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} end={item.url === "/admin"} className="hover:bg-muted/50" activeClassName="bg-accent text-accent-foreground font-medium">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
