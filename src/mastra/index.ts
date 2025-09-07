import 'dotenv/config';
import "reflect-metadata";
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { storage } from './utils/memory';
import { discoveryWorkflow, iterateWorkflow } from './workflows/discovery';
import ideaEnricher from './discovery/specialists/idea.enricher';
import ideaImprover from './discovery/specialists/idea.improver';
import engineeringEvaluator from './discovery/specialists/engineering.evaluator';
import marketingEvaluator from './discovery/specialists/marketing.evaluator';
import salesOpsEvaluator from './discovery/specialists/salesops.evaluator';
import pmEvaluator from './discovery/specialists/pm.evaluator';
import { initializeDatabase } from '../config/database';

await initializeDatabase();

// Initialize Mastra instance
export const mastra = new Mastra({
  workflows: { discoveryWorkflow, iterateWorkflow },
  agents: { ideaEnricher, ideaImprover, engineeringEvaluator, marketingEvaluator, salesOpsEvaluator, pmEvaluator },
  storage, // Initialize storage for the main Mastra instance
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
