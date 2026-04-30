import type { SignupInput } from "@/lib/schemas/user.schema";

export type SignupRequest = SignupInput & {
  ipAddress?: string;
  userAgent?: string;
};

export type SignupResult = {
  userId: string;
  requiresEmailConfirmation: boolean;
};

export type AppRole = "founder" | "curator" | "operations";
export type Cohort = "beta";

export type AppMetadata = {
  role?: AppRole;
  cohort?: Cohort;
};

export function getAppMetadata(
  session: { user: { app_metadata?: unknown } } | null | undefined
): AppMetadata {
  return (session?.user.app_metadata as AppMetadata | null | undefined) ?? {};
}
