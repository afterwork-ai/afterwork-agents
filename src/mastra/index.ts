import 'dotenv/config';
import "reflect-metadata";
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { storage } from './utils/memory';
import { discoveryWorkflow, iterateWorkflow } from './stages/discovery/workflows';
import { productDesignWorkflow } from './stages/design/workflows';
import engineeringTasker from './stages/design/specialists/engineering.tasker';
import scrumMaster from './stages/design/specialists/scrum.master';
import ideaEnricher from './stages/discovery/specialists/idea.enricher';
import ideaImprover from './stages/discovery/specialists/idea.improver';
import engineeringEvaluator from './stages/discovery/specialists/engineering.evaluator';
import marketingEvaluator from './stages/discovery/specialists/marketing.evaluator';
import salesOpsEvaluator from './stages/discovery/specialists/salesops.evaluator';
import pmEvaluator from './stages/discovery/specialists/pm.evaluator';
import { initializeDatabase } from '../config/database';

await initializeDatabase();

// Initialize Mastra instance
export const mastra = new Mastra({
  workflows: { productDesignWorkflow, discoveryWorkflow, iterateWorkflow },
  agents: { ideaEnricher, ideaImprover, engineeringEvaluator, marketingEvaluator, salesOpsEvaluator, pmEvaluator, engineeringTasker, scrumMaster },
  storage, // Initialize storage for the main Mastra instance
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});