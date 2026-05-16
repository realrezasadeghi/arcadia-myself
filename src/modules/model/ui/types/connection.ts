import type { ElementTypeValue } from "./element";
import type { RelationshipTypeValue } from "./relationship";

export type ConnectionRule = {
  relationshipType: RelationshipTypeValue;
  allowedSources: ElementTypeValue[];
  allowedTargets: ElementTypeValue[];
};
