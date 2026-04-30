import type { SignupInput } from "@/lib/schemas/user.schema";

export type SignupRequest = SignupInput & {
  ipAddress?: string;
  userAgent?: string;
};

export type SignupResult = {
  userId: string;
  requiresEmailConfirmation: boolean;
};
