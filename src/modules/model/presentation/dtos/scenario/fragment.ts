import { z } from "zod";

export const createScenarioFragmentSchema = z.object({
  diagramId: z.string().uuid(),
  type: z.enum([
    "alt",
    "opt",
    "loop",
    "break",
    "par",
    "critical",
    "region",
    "neg",
    "assert",
    "ignore",
    "consider",
  ]),
  guard: z.string().max(500).optional(),
  parentFragmentId: z.string().uuid().nullable().optional(),
  minSequenceOrder: z.number().int().min(0),
  maxSequenceOrder: z.number().int().min(0),
});

export type CreateScenarioFragmentDTO = z.infer<typeof createScenarioFragmentSchema>;

export const updateScenarioFragmentSchema = z.object({
  id: z.string().uuid(),
  guard: z.string().max(500).optional(),
  layout: z
    .object({
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      size: z.object({ width: z.number(), height: z.number() }).optional(),
    })
    .optional(),
});

export type UpdateScenarioFragmentDTO = z.infer<typeof updateScenarioFragmentSchema>;