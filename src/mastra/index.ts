import 'dotenv/config';
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { MongoDBStore } from '@mastra/mongodb';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';


// Get MongoDB connection string with proper fallback
const mongoUrl = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017';

// Initialize MongoDB storage for the main Mastra instance
const storage = new MongoDBStore({
  url: mongoUrl,
  dbName: 'afterwork-db',
});

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage, // Add storage to the main Mastra instance
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
