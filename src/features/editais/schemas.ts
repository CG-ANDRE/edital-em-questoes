import { z } from "zod";

export const EditalVisibilitySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("public") }),
  z.object({ type: z.literal("beta") }),
  z.object({
    type: z.literal("allowlist"),
    userIds: z.array(z.string().uuid()),
  }),
]);

export const EditalListFiltersSchema = z.object({
  banca: z.string().optional(),
  orgao: z.string().optional(),
  ano: z.number().int().min(2020).max(2099).optional(),
  q: z.string().max(100).optional(),
});
