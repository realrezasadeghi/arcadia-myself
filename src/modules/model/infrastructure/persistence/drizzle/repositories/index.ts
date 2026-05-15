import { DrizzleDiagramRepository } from "./diagram";
import { DrizzleElementRepository } from "./element";
import { DrizzleModelRepository } from "./model";
import { DrizzleRelationshipRepository } from "./relationship";
import { DrizzleTraceLinkRepository } from "./trace-link";

export const modelRepository = new DrizzleModelRepository();

export const diagramRepository = new DrizzleDiagramRepository();

export const elementRepository = new DrizzleElementRepository();

export const traceLinkRepository = new DrizzleTraceLinkRepository();

export const relationshipRepository = new DrizzleRelationshipRepository();
