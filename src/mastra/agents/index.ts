import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { MongoDBStore, MongoDBVector } from '@mastra/mongodb';
import { weatherTool } from '../tools';

// Get MongoDB connection string with proper fallback
const mongoUrl = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017';

// Initialize MongoDB storage for memory
const storage = new MongoDBStore({
  url: mongoUrl,
  dbName: 'afterwork-db',
});

// Initialize MongoDB vector store for semantic recall
const vector = new MongoDBVector({
  uri: mongoUrl,
  dbName: 'afterwork-db',
});

// Initialize memory with MongoDB storage and vector store
const memory = new Memory({
  storage,
  vector,
  embedder: openai.embedding('text-embedding-3-small'), // Add embedder for semantic recall
  options: {
    lastMessages: 50, // Keep last 50 messages in context
    semanticRecall: {
      topK: 3, // Retrieve 3 most similar messages
      messageRange: 2, // Include 2 messages before and after each match
      scope: 'thread', // Search within current thread
    },
    workingMemory: {
      enabled: true,
      template: `# User Profile
- **Name**: 
- **Location**: 
- **Weather Preferences**: 
- **Last Asked About**: 
- **Notes**: 
`,
    },
  },
});

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - Remember user preferences and past conversations to provide personalized service

      Use the weatherTool to fetch current weather data.
`,
  model: openai('gpt-5'),
  tools: { weatherTool },
  memory,
});
