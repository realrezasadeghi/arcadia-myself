"use server";

import { cookiesStorageService } from "@/modules/shared/infrastructure/services";
import { fail, type IRes, ok } from "@/modules/shared/utils/response";
import { scenarioDiagramRepository, modelRepository } from "@/modules/model/infrastructure/persistence/drizzle/repositories";

export type ScenarioDiagramsByModelResponse = {
  id: string;
  modelId: string;
  type: string;
  viewport: { x: number; y: number; zoom: number; timeScale: number };
  layoutConfig: { lifelineSpacing: number; messageHeight: number; fragmentPadding: number; headHeight: number; activationWidth: number };
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
};

export async function getScenarioDiagramsByModelId(
  modelId: string,
): Promise<IRes<ScenarioDiagramsByModelResponse[]>> {
  try {
    const token = await cookiesStorageService.get("token");

    if (!token) {
      throw new Error("Token is required");
    }

    if (!modelId) {
      throw new Error("Model id is required.");
    }

    const model = await modelRepository.findModelById(modelId);
    if (!model) throw new Error(`Model not found with id : ${modelId}`);

    const diagrams = await scenarioDiagramRepository.findByModelId(modelId);

    return ok(diagrams.map((d) => d.toJSON()));
  } catch (error) {
    return fail(error);
  }
}