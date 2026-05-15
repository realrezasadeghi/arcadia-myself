import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type { LayerValue } from "../../domain/value-objects/layer";
import type { TraceLinkTypeValue } from "../../domain/value-objects/relationship-type";
import type { IElementRepository } from "../ports/element";
import type { ITraceLinkRepository } from "../ports/trace-link";

export type GetTraceLinksByElementIdPayload = {
  query: {
    elementId: string;
  };
  context: {
    token: string;
  };
};

export type GetTraceLinksByElementIdResponse = {
  id: string;
  projectId: number;
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
 * GetTraceLinksByElementUseCase
 *
 * تمام Trace Link هایی که یک المنت در آن‌ها source یا target است را بازمی‌گرداند.
 * برای نمایش پانل ردیابی در Properties Panel استفاده می‌شود.
 */
export class GetTraceLinksByElementIdUseCase
  implements
    IUseCase<
      GetTraceLinksByElementIdPayload,
      GetTraceLinksByElementIdResponse[]
    >
{
  constructor(
    private readonly traceLinkRepository: ITraceLinkRepository,
    private readonly elementRepository: IElementRepository,
  ) {}

  async execute({
    query,
  }: GetTraceLinksByElementIdPayload): Promise<
    GetTraceLinksByElementIdResponse[]
  > {
    try {
      const element = await this.elementRepository.findElementById({
        id: query.elementId,
      });

      if (!element) {
        throw new Error(`Element not found with id ${query.elementId}`);
      }

      const response = await this.traceLinkRepository.findByElementId(query);

      return response.map((trace) => trace.toJSON());
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error in get trace links by element id"),
      );
    }
  }
}
