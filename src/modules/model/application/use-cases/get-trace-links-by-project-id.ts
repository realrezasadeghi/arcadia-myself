import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { LayerValue } from "../../domain/value-objects/layer";
import type { TraceLinkTypeValue } from "../../domain/value-objects/relationship-type";
import type { ITraceLinkRepository } from "../ports/trace-link";

export type GetTraceLinksByProjectIdPayload = {
  query: {
    projectId: string;
  };
  context: {
    token: string;
  };
};

export type GetTraceLinksByProjectIdResponse = {
  id: string;
  projectId: string;
  type: TraceLinkTypeValue;
  updatedAt: string;
  createdAt: string;
  sourceElementId: string;
  sourceLayer: LayerValue;
  targetElementId: string;
  targetLayer: LayerValue;
  description?: string;
};

/**
 * GetTraceLinksByProjectIdUseCase
 *
 * تمام Trace Link های یک پروژه را بازمی‌گرداند.
 * برای نمایش Trace Matrix کامل استفاده می‌شود.
 */
export class GetTraceLinksByProjectIdUseCase
  implements
    IUseCase<
      GetTraceLinksByProjectIdPayload,
      GetTraceLinksByProjectIdResponse[]
    >
{
  constructor(private readonly traceLinkRepository: ITraceLinkRepository) {}

  async execute({
    query,
  }: GetTraceLinksByProjectIdPayload): Promise<
    GetTraceLinksByProjectIdResponse[]
  > {
    try {
      const response = await this.traceLinkRepository.findByProjectId(query);

      return response.map((trace) => trace.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get trace links by project id"),
      );
    }
  }
}
