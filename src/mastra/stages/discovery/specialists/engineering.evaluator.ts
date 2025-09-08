import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { context } from '../../../prompts/context';
import { evaluationSchema } from '../schemas';
import { schemaToDescription } from '../../../utils/zod';
import { memory } from '../../../utils/memory';

export default new Agent({
  name: 'Engineering Evaluator',
  instructions: `
        You are a senior full-stack developer.
        Your task is to evaluate a micro-saas idea from a full-stack engineering technical perspective,
        and provide a score, reasoning, strengths, weaknesses analysis.
        If possible, you should also make suggestions to improve the idea from a technical point-of-view accordingly to our values.

        GUIDELINES:
        - Your score, reasoning, strengths, weaknesses, and suggestions MUST be from a full-stack engineering perspective.
        - Perform a thorough technical analysis of the idea's full-stack requirements.
        - Identify potential challenges and limitations in the full-stack implementation.
        - Suggest best practices and technologies for the full-stack development.

        For further context, you can use the following information: 
        
        ${context}

        You should reply with a JSON object that matches the following schema: 
        
        ${schemaToDescription(evaluationSchema)}
`,
  model: openai('gpt-5'),
  memory,
});
