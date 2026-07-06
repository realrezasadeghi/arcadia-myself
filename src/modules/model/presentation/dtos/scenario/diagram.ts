import { z } from "zod";

export const createScenarioDiagramSchema = z.object({
  modelId: z.string().uuid(),
  type: z.enum(["OIS", "SS", "LS", "PS"]),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
});

export type CreateScenarioDiagramDTO = z.infer<typeof createScenarioDiagramSchema>;

export const updateScenarioDiagramSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
      timeScale: z.number(),
    })
    .optional(),
  layoutConfig: z
    .object({
      lifelineSpacing: z.number(),
      messageHeight: z.number(),
      fragmentPadding: z.number(),
      headHeight: z.number(),
      activationWidth: z.number(),
    })
    .optional(),
});

export type UpdateScenarioDiagramDTO = z.infer<typeof updateScenarioDiagramSchema>;