import { DrizzleClassDiagramRepository } from "./class-diagram";
import { DrizzleDiagramRepository } from "./diagram";
import { DrizzleElementRepository } from "./element";
import { DrizzleFragmentRepository } from "./fragment";
import { DrizzleLifelineRepository } from "./lifeline";
import { DrizzleModelRepository } from "./model";
import { DrizzleRelationshipRepository } from "./relationship";
import { DrizzleScenarioRepository } from "./scenario";
import { DrizzleMessageRepository } from "./sequence-message";
import { DrizzleTraceLinkRepository } from "./trace-link";

export const modelRepository = new DrizzleModelRepository();

export const diagramRepository = new DrizzleDiagramRepository();

export const elementRepository = new DrizzleElementRepository();

export const traceLinkRepository = new DrizzleTraceLinkRepository();

export const relationshipRepository = new DrizzleRelationshipRepository();

export const classDiagramRepository = new DrizzleClassDiagramRepository();

export const scenarioRepository = new DrizzleScenarioRepository();

export const lifelineRepository = new DrizzleLifelineRepository();

export const messageRepository = new DrizzleMessageRepository();

export const fragmentRepository = new DrizzleFragmentRepository();
