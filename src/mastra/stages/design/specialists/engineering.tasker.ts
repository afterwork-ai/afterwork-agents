import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { context } from '../../../prompts/context';
import { schemaToDescription } from '../../../utils/zod';
import { memory } from '../../../utils/memory';
import { basicTaskSchema } from '../schemas';

export default new Agent({
  name: 'Engineering Task Creator',
  instructions: `
        You are a senior full-stack developer.
        Your excel in breaking down a product task into a list of sub-tasks from a full-stack engineering technical perspective.
        You are currently a part of an agile development squad in the middle of the stage of design, so you are only concerned with planning the engineering tasks needed to build the product.

        GUIDELINES:
        - Your tasks MUST be from a full-stack engineering technical perspective.
        - Your tasks MUST be in the format of a list of tasks.

        For further context, you can use the following information: 
        
        ${context}

        You should reply with a JSON object that matches the following schema: 
        
        ${schemaToDescription(basicTaskSchema)}

        IMPORTANT: Do not include any markdown formatting or other text or comments in your response, just the JSON object.
`,
  model: openai('gpt-4o-mini'),
  memory,
});
