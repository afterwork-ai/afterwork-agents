import { Memory } from "@mastra/memory";
import { MongoDBStore, MongoDBVector } from "@mastra/mongodb";

// Get MongoDB connection string with proper fallback
export const mongoUrl = process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017';

// Initialize MongoDB storage for memory
export const storage = new MongoDBStore({
  url: mongoUrl,
  dbName: 'afterwork-db',
});

// Initialize MongoDB vector store for semantic recall
export const vector = new MongoDBVector({
  uri: mongoUrl,
  dbName: 'afterwork-db',
});

// Initialize memory with MongoDB storage (without vector store for now)
export const memory = new Memory({
  storage,
  // vector, // Commented out - requires Atlas Search
  // embedder: openai.embedding('text-embedding-3-small'), // Commented out - requires Atlas Search
  options: {
    lastMessages: 50, // Keep last 50 messages in context
    semanticRecall: false, // Disabled - requires Atlas Search
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
