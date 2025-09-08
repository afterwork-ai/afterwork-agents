import { createStep } from '@mastra/core/workflows';
import { enrichedIdeaSchema } from '../../../discovery/schemas';
import scrumMaster from '../../specialists/scrum.master';
import { z } from 'zod';
import { epicSchema } from '../../schemas/epic.schema';
import { v4 as uuidv4 } from 'uuid';

export default createStep({
    id: `create-epics`,
    description: `Breaks down the micro-saas idea into epics`,
    inputSchema: enrichedIdeaSchema,
    outputSchema: z.array(epicSchema).describe(`high-level epics for the micro-saas idea`),
    execute: async ({ inputData, workflowId, runId, mastra }) => {
      // get the enriched idea
      const enrichedIdea = inputData;
      // get the logger
      const logger = mastra.getLogger();
      // create the epics
      const response = await scrumMaster.generate([
        { role: 'user', content: 
          `Break down the micro-saas idea into high-level epics.
           Do not include any user stories, features, or tasks, only epics.
          
           The micro-saas idea is:

          ${JSON.stringify(enrichedIdea, null, 2)}` 
        }
      ], {
        memory: {
          thread: `${workflowId}-${runId}`,
          resource: `user-${runId}`
        }
      });

      const epics = JSON.parse(response.text)
                        .map((epic: any) => ({
                          ...epic,
                          epicId: uuidv4(),
                        }));

      return epics;
    },
  });