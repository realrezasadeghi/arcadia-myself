import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import { FragmentOperator } from "../../domain/value-objects/fragment-operator";
import type { IFragmentRepository } from "../ports/fragment";
import type { IScenarioRepository } from "../ports/scenario";

export type CreateFragmentPayload = {
  payload: {
    scenarioId: string;
    name: string;
    operator: string;
    guard?: string;
    rowIndex: number;
    columnIndex: number;
    spanColumns?: number;
  };
  context: {
    token: string;
  };
};

export type CreateFragmentResponse = {
  id: string;
  scenarioId: string;
  name: string;
  operator: string;
  guard: string;
  rowIndex: number;
  columnIndex: number;
  spanColumns: number;
  createdAt: string;
  updatedAt: string;
};

export class CreateFragmentUseCase
  implements IUseCase<CreateFragmentPayload, CreateFragmentResponse>
{
  constructor(
    private readonly fragmentRepository: IFragmentRepository,
    private readonly scenarioRepository: IScenarioRepository,
  ) {}

  async execute({
    payload,
  }: CreateFragmentPayload): Promise<CreateFragmentResponse> {
    try {
      const scenario = await this.scenarioRepository.findById({
        id: payload.scenarioId,
      });
      if (!scenario)
        throw new Error(`Scenario not found with id: ${payload.scenarioId}`);

      const operator = FragmentOperator.from(payload.operator);

      const fragment = await this.fragmentRepository.create({
        scenarioId: payload.scenarioId,
        name: payload.name,
        operator,
        guard: payload.guard,
        rowIndex: payload.rowIndex,
        columnIndex: payload.columnIndex,
        spanColumns: payload.spanColumns,
      });

      return fragment.toJSON();
    } catch (error) {
      throw new Error(resolveErrorMessage(error, "Error in create fragment"));
    }
  }
}
