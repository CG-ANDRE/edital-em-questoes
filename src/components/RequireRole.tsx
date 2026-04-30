import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/useSession";

type Props = {
  role: "founder" | "curator" | "operations";
  children: React.ReactNode;
};

export function RequireRole({ role, children }: Props) {
  const { isLoading, isAuthenticated, session } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole =
    (session?.user.app_metadata as { role?: string } | null)?.role ?? null;

  if (userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
