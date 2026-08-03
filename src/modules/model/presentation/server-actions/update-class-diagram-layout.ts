"use server";

import { withAuth } from "@/modules/auth/presentation/with-auth";
import { classDiagramRepository } from "../../infrastructure/persistence/drizzle/repositories";

export type UpdateClassDiagramLayoutPayload = {
  id: string;
  modelId: string;
  viewport?: { x: number; y: number; zoom: number };
  elementLayouts?: Array<{
    elementId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
};

export type UpdateClassDiagramLayoutResponse = {
  id: string;
  modelId: string;
  name: string;
  description: string | undefined;
  viewport: { x: number; y: number; zoom: number };
  elementLayouts: Array<{
    elementId: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }>;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const updateClassDiagramLayout = withAuth(
  async (payload: UpdateClassDiagramLayoutPayload, { token }): Promise<UpdateClassDiagramLayoutResponse> => {
    const response = await classDiagramRepository.updateLayout({
      id: payload.id,
      viewport: payload.viewport,
      elementLayouts: payload.elementLayouts,
    });

    return response.toJSON();
  },
);
