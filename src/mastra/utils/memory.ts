import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { openai } from '@ai-sdk/openai';

// Get PostgreSQL connection string with proper fallback
export const postgresUrl = process.env.POSTGRES_CONNECTION_STRING || 'postgresql://postgres:password@localhost:5432/afterwork_db';

// Initialize PostgreSQL storage for memory
export const storage = new PostgresStore({
  connectionString: postgresUrl,
});

// Initialize PostgreSQL vector store for semantic recall
export const vector = new PgVector({
  connectionString: postgresUrl,
});

// Initialize memory with PostgreSQL storage and vector store
export const memory = new Memory({
  storage,
  vector,
  embedder: openai.embedding('text-embedding-3-small'),
  options: {
    lastMessages: 50, // Keep last 50 messages in context
    semanticRecall: {
      topK: 3,
      messageRange: 2,
      scope: 'thread',
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
