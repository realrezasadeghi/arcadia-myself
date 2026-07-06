import { z } from "zod";

export const deleteScenarioLifelineSchema = z.object({
  lifelineId: z.string().uuid(),
});

export type DeleteScenarioLifelineDTO = z.infer<
  typeof deleteScenarioLifelineSchema
>;

export const deleteScenarioMessageSchema = z.object({
  messageId: z.string().uuid(),
});

export type DeleteScenarioMessageDTO = z.infer<
  typeof deleteScenarioMessageSchema
>;

export const deleteScenarioFragmentSchema = z.object({
  fragmentId: z.string().uuid(),
});

export type DeleteScenarioFragmentDTO = z.infer<
  typeof deleteScenarioFragmentSchema
>;

export const deleteScenarioDiagramSchema = z.object({
  diagramId: z.string().uuid(),
});

export type DeleteScenarioDiagramDTO = z.infer<
  typeof deleteScenarioDiagramSchema
>;

export const updateScenarioLayoutSchema = z.object({
  diagramId: z.string().uuid(),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
      timeScale: z.number(),
    })
    .optional(),
  lifelinePositions: z
    .array(
      z.object({
        id: z.string().uuid(),
        position: z.object({ x: z.number(), y: z.number() }),
        size: z
          .object({ width: z.number(), height: z.number() })
          .optional(),
      }),
    )
    .optional(),
  fragmentPositions: z
    .array(
      z.object({
        id: z.string().uuid(),
        position: z.object({ x: z.number(), y: z.number() }),
        size: z
          .object({ width: z.number(), height: z.number() })
          .optional(),
      }),
    )
    .optional(),
});

export type UpdateScenarioLayoutDTO = z.infer<
  typeof updateScenarioLayoutSchema
>;
