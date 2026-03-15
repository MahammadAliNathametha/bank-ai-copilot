import { z } from "zod";

export const clientErrorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  source: z.string().optional(),
  path: z.string().optional(),
  userAgent: z.string().optional(),
  digest: z.string().optional()
});

export const performanceMetricSchema = z.object({
  path: z.string(),
  duration: z.number().min(0),
  category: z.enum(["navigation", "render", "api", "custom"]).optional(),
  tags: z.record(z.string()).optional()
});
