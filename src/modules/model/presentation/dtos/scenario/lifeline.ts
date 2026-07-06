import { z } from "zod";

export const createScenarioLifelineSchema = z.object({
  diagramId: z.string().uuid(),
  elementId: z.string().uuid(),
  type: z.enum([
    "actor",
    "entity",
    "component",
    "function",
    "boundary",
    "control",
    "database",
    "gate",
  ]),
  selector: z.string().max(200).optional(),
  decomposed: z.boolean().optional(),
});

export type CreateScenarioLifelineDTO = z.infer<typeof createScenarioLifelineSchema>;

export const updateScenarioLifelineSchema = z.object({
  id: z.string().uuid(),
  selector: z.string().max(200).optional(),
  decomposed: z.boolean().optional(),
  layout: z
    .object({
      position: z.object({ x: z.number(), y: z.number() }).optional(),
      size: z.object({ width: z.number(), height: z.number() }).optional(),
      headPosition: z.number().optional(),
    })
    .optional(),
});

export type UpdateScenarioLifelineDTO = z.infer<typeof updateScenarioLifelineSchema>;