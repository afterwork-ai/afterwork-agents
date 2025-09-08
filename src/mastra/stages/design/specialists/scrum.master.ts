import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { context } from '../../../prompts/context';
import { schemaToDescription } from '../../../utils/zod';
import { memory } from '../../../utils/memory';
import { basicTaskSchema } from '../schemas';

export default new Agent({
  name: 'Scrum Master',
  instructions: `
        You are a senior product manager and and agile scrum master.
        Your excel in breaking down a micro-saas idea into epics, user stories, features and a list of tasks from a product management perspective.
        You are the scrum master of an agile development squad that is in the middle of the stage of design, so you are only concerned with planning the product tasks needed to build the product.

        GUIDELINES:
        - Your tasks MUST be from a product management perspective.
        - Your tasks MUST be in the format of a list of tasks.

        For further context, you can use the following information: 
        
        ${context}

        You should reply with a JSON object that matches the following schema: 

        ${schemaToDescription(basicTaskSchema)}
        
        IMPORTANT: Do not include any other text or comments in your response, just the JSON object.
`,
  model: openai('gpt-5'),
  memory,
});
