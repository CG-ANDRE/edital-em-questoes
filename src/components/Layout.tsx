import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileQuestion, BarChart3, Crown, Flame, LogOut, Mail, BookOpen, CalendarDays } from "lucide-react";
import { user } from "@/data/mockData";

const navItems = [
  { path: "/dashboard", label: "Início", icon: Home },
  { path: "/practice", label: "Questões", icon: FileQuestion },
  { path: "/performance", label: "Desempenho", icon: BarChart3 },
  { path: "/materials", label: "Materiais", icon: BookOpen },
  { path: "/contact", label: "Contato", icon: Mail },
  { path: "/plans", label: "Planos", icon: Crown },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="font-heading text-lg font-bold text-primary-foreground">LQ</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-sm font-bold leading-tight text-primary">LegisQuest</p>
              <p className="text-xs text-muted-foreground">Questões</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/plans"
              className="hidden items-center gap-1.5 rounded-full bg-highlight px-4 py-1.5 text-sm font-bold text-highlight-foreground transition-transform hover:scale-105 sm:flex"
            >
              <Crown className="h-4 w-4" />
              Premium
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
              <Flame className="h-4 w-4 text-highlight" />
              <span className="text-sm font-bold text-foreground">{user.streak}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
