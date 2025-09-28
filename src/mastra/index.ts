import 'dotenv/config';
import "reflect-metadata";
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { storage } from './utils/memory';
import { initializeDatabase } from '../config/database';
import { bizProcessAgent } from './specialists/biz-process';

await initializeDatabase();

// Initialize Mastra instance
export const mastra = new Mastra({
  workflows: {  },
  agents: { bizProcessAgent },
  storage, // Initialize storage for the main Mastra instance
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});