import { z } from "zod";

export const reorderScenarioMessagesSchema = z.object({
  diagramId: z.string().uuid(),
  messageIds: z.array(z.string().uuid()).min(1),
});

export type ReorderScenarioMessagesDTO = z.infer<typeof reorderScenarioMessagesSchema>;

export const getScenarioDataSchema = z.object({
  diagramId: z.string().uuid(),
});

export type GetScenarioDataDTO = z.infer<typeof getScenarioDataSchema>;

export const validateScenarioSchema = z.object({
  diagramId: z.string().uuid(),
});

export type ValidateScenarioDTO = z.infer<typeof validateScenarioSchema>;