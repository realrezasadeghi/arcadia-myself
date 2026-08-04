import type { IUseCase } from "@/modules/shared/application/interfaces/use-case";
import { resolveErrorMessage } from "@/modules/shared/utils/resolve-error-message";
import type {
  IClassDiagramRepository,
  FindClassElementsByModelIdQuery,
} from "../../ports/class-diagram";

export type GetClassElementsByModelIdUseCasePayload = {
  query: FindClassElementsByModelIdQuery;
  context: {
    token: string;
  };
};

type PropertyResponse = {
  id: string;
  classElementId: string;
  name: string;
  description: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  isStatic: boolean;
  isReadOnly: boolean;
  isDerived: boolean;
  isID: boolean;
  visibility: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  isOrdered: boolean;
  isUnique: boolean;
  collectionKind: string;
  aggregationKind: string;
  defaultValue: string;
  ordering: number;
  status: string;
};

type OperationParameterResponse = {
  id: string;
  classOperationId: string;
  name: string;
  typeClassElementId: string | null;
  typeLiteral: string;
  multiplicityLower: number;
  multiplicityUpper: string;
  defaultValue: string | null;
  direction: string;
  isOrdered: boolean;
  isUnique: boolean;
  ordering: number;
};

type OperationResponse = {
  id: string;
  classElementId: string;
  name: string;
  description: string;
  returnTypeClassElementId: string | null;
  returnTypeLiteral: string;
  isStatic: boolean;
  isAbstract: boolean;
  visibility: string;
  ordering: number;
  status: string;
  parameters: OperationParameterResponse[];
};

type EnumerationLiteralResponse = {
  id: string;
  classElementId: string;
  name: string;
  value: string;
  ordering: number;
  status: string;
};

export type GetClassElementsByModelIdUseCaseResponse = {
  id: string;
  modelId: string;
  layer: string;
  name: string;
  description: string;
  visibility: string;
  elementType: string;
  isAbstract: boolean;
  isStatic: boolean;
  parentId: string | null;
  ordering: number;
  status: string;
  extensionProperties: Record<string, unknown>;
  properties: PropertyResponse[];
  operations: OperationResponse[];
  enumerationLiterals: EnumerationLiteralResponse[];
  createdAt: string;
  updatedAt: string;
}[];

export class GetClassElementsByModelIdUseCase
  implements
    IUseCase<
      GetClassElementsByModelIdUseCasePayload,
      GetClassElementsByModelIdUseCaseResponse
    >
{
  constructor(private readonly repository: IClassDiagramRepository) {}

  async execute({
    query,
  }: GetClassElementsByModelIdUseCasePayload): Promise<GetClassElementsByModelIdUseCaseResponse> {
    try {
      const elements = await this.repository.findElementsByModelId(query);

      const enriched = await Promise.all(
        elements.map(async (element) => {
          const [properties, operations, enumerationLiterals] =
            await Promise.all([
              this.repository.findPropertiesByElementId({
                classElementId: element.id,
              }),
              this.repository.findOperationsByElementId({
                classElementId: element.id,
              }),
              this.repository.findEnumerationLiteralsByElementId({
                classElementId: element.id,
              }),
            ]);

          const operationsWithParams = await Promise.all(
            operations.map(async (op) => {
              const parameters =
                await this.repository.findParametersByOperationId({
                  classOperationId: op.id,
                });
              return {
                id: op.id,
                classElementId: op.classElementId,
                name: op.name,
                description: op.description,
                returnTypeClassElementId: op.returnTypeClassElementId,
                returnTypeLiteral: op.returnTypeLiteral,
                isStatic: op.isStatic,
                isAbstract: op.isAbstract,
                visibility: op.visibility.value,
                ordering: op.ordering,
                status: op.status,
                parameters: parameters.map((p) => ({
                  id: p.id,
                  classOperationId: p.classOperationId,
                  name: p.name,
                  typeClassElementId: p.typeClassElementId,
                  typeLiteral: p.typeLiteral,
                  multiplicityLower: p.multiplicityLower,
                  multiplicityUpper: p.multiplicityUpper,
                  defaultValue: p.defaultValue,
                  direction: p.direction.value,
                  isOrdered: p.isOrdered,
                  isUnique: p.isUnique,
                  ordering: p.ordering,
                })),
              };
            }),
          );

          return {
            ...element.toJSON(),
            properties: properties.map((p) => ({
              id: p.id,
              classElementId: p.classElementId,
              name: p.name,
              description: p.description,
              typeClassElementId: p.typeClassElementId,
              typeLiteral: p.typeLiteral,
              isStatic: p.isStatic,
              isReadOnly: p.isReadOnly,
              isDerived: p.isDerived,
              isID: p.isID,
              visibility: p.visibility.value,
              multiplicityLower: p.multiplicityLower,
              multiplicityUpper: p.multiplicityUpper,
              isOrdered: p.isOrdered,
              isUnique: p.isUnique,
              collectionKind: p.collectionKind.value,
              aggregationKind: p.aggregationKind.value,
              defaultValue: p.defaultValue,
              ordering: p.ordering,
              status: p.status,
            })),
            operations: operationsWithParams,
            enumerationLiterals: enumerationLiterals.map((el) => ({
              id: el.id,
              classElementId: el.classElementId,
              name: el.name,
              value: el.value,
              ordering: el.ordering,
              status: el.status,
            })),
          };
        }),
      );

      return enriched;
    } catch (error) {
      throw new Error(
        resolveErrorMessage(error, "Error getting class elements"),
      );
    }
  }
}
