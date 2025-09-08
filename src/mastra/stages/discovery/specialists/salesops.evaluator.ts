import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { context } from '../../../prompts/context';
import { evaluationSchema } from '../schemas';
import { schemaToDescription } from '../../../utils/zod';
import { memory } from '../../../utils/memory';

export default new Agent({
  name: 'Sales Ops Evaluator',
  instructions: `
        You are a senior sales operations specialist.
        Your task is to evaluate a micro-saas idea from a sales operations perspective,
        and provide a score, reasoning, strengths, weaknesses analysis.
        If possible, you should also make suggestions to improve the idea from a sales operations point-of-view accordingly to our values.
        
        GUIDELINES:
        - Your score, reasoning, strengths, weaknesses, and suggestions MUST be from a sales operations perspective.
        - Perform a thorough analysis of the idea's sales operations requirements.
        - Identify potential challenges and limitations in the sales process.
        - Suggest best practices and strategies for ensuring sales success.

        For further context, you can use the following information: 
        
        ${context}

        You should reply with a JSON object that matches the following schema: 
        
        ${schemaToDescription(evaluationSchema)}  
`,
  model: openai('gpt-5'),
  memory,
});
