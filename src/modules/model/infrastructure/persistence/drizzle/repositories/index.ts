import { DrizzleDiagramRepository } from "./diagram";
import { DrizzleElementRepository } from "./element";
import { DrizzleModelRepository } from "./model";
import { DrizzleRelationshipRepository } from "./relationship";
import { DrizzleTraceLinkRepository } from "./trace-link";
import { DrizzleScenarioDiagramRepository } from "./scenario";
import { DrizzleScenarioLifelineRepository } from "./scenario";
import { DrizzleScenarioMessageRepository } from "./scenario";
import { DrizzleScenarioFragmentRepository } from "./scenario";

export const modelRepository = new DrizzleModelRepository();

export const diagramRepository = new DrizzleDiagramRepository();

export const elementRepository = new DrizzleElementRepository();

export const traceLinkRepository = new DrizzleTraceLinkRepository();

export const relationshipRepository = new DrizzleRelationshipRepository();

export const scenarioDiagramRepository = new DrizzleScenarioDiagramRepository();

export const scenarioLifelineRepository = new DrizzleScenarioLifelineRepository();

export const scenarioMessageRepository = new DrizzleScenarioMessageRepository();

export const scenarioFragmentRepository = new DrizzleScenarioFragmentRepository();
