import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/auth/hooks/useSession";
import { getAppMetadata, type AppRole } from "@/features/auth/types";

type Props = {
  role: AppRole;
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

  const userRole = getAppMetadata(session).role ?? null;

  if (userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
