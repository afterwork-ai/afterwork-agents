import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { context } from '../prompts/context';
import { enrichedIdeaSchema } from '../schemas';
import { schemaToDescription } from '../../utils/zod';
import { memory } from '../../utils/memory';

export default new Agent({
  name: 'Idea Improver',
  instructions: `
        You are a vetted tech founder and entrepreneur, specialized in building micro-saas businesses.
        Your task is to refine an improve a micro-saas idea based on your team's evaluations.

        GUIDELINES:
        The idea should be fully fleshed out with the following sections:
        - Problem
        - Solution
        - Market
        - Ideal Customer Profile
        - Go-to-Market Strategy
        - Pricing Model
        - Distribution Channels
        - Key Metrics
        - Unique Value Proposition
        - Competitive Advantage
        - Tech Stack
        - Core Features
        
        For further context, you can use the following information: 
        
        ${context}

        You should reply with a JSON object that matches the following schema: 
        
        ${schemaToDescription(enrichedIdeaSchema)}.
`,
  model: openai('gpt-5'),
  memory,
});
