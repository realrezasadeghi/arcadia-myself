import { z } from "zod";

export const createScenarioMessageSchema = z.object({
  diagramId: z.string().uuid(),
  sourceLifelineId: z.string().uuid(),
  targetLifelineId: z.string().uuid(),
  sort: z.enum(["sync", "async", "reply", "create", "destroy", "found", "lost"]),
  name: z.string().min(1).max(200),
  signature: z.string().max(500).optional(),
  arguments: z.string().optional(),
  fragmentId: z.string().uuid().nullable().optional(),
  sequenceOrder: z.number().int().min(0),
});

export type CreateScenarioMessageDTO = z.infer<typeof createScenarioMessageSchema>;

export const updateScenarioMessageSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  signature: z.string().max(500).optional(),
  arguments: z.string().optional(),
  fragmentId: z.string().uuid().nullable().optional(),
  sequenceOrder: z.number().int().min(0).optional(),
  layout: z
    .object({
      position: z.object({ x: z.number(), y: z.number() }).optional(),
    })
    .optional(),
});

export type UpdateScenarioMessageDTO = z.infer<typeof updateScenarioMessageSchema>;