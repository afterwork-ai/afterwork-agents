import { createStep } from '@mastra/core/workflows';
import scrumMaster from '../../specialists/scrum.master';
import { epicSchema } from '../../schemas/epic.schema';
import { z } from 'zod';
import { userStorySchema } from '../../schemas/user.story.schema';
import { v4 as uuidv4 } from 'uuid';

export default createStep({
    id: `create-user-stories`,
    description: `Breaks down epic into user stories`,
    inputSchema: epicSchema,
    outputSchema: z.array(userStorySchema).describe(`high-level user stories for the given epic`),
    execute: async ({ inputData, workflowId, runId }) => {

      // get the epic
      const epic = inputData;

      const response = await scrumMaster.generate([
        { role: 'user', content: 
          `Break down the epic into user stories
           Do not include any epics, features or tasks, only user stories.

           The epic is:

          ${JSON.stringify(epic, null, 2)}` 
        }
      ], {
        memory: {
          thread: `${workflowId}-${runId}`,
          resource: `user-${runId}`
        }
      });


      const userStories = JSON.parse(response.text)
                        .map((userStory: any) => ({
                          ...userStory,
                          epicId: epic.epicId,
                          userStoryId: uuidv4(),
                        }));

      return userStories;
    },
  });



  export const combineUserStories =  createStep({
    id: `combine-user-stories`,
    description: 'Combines all the user stories from all the epics',
    inputSchema: z.array(z.array(userStorySchema).describe('The list of user stories of a single epic')).describe('The combined list of user stories for all epics'),
    outputSchema: z.array(userStorySchema).describe('The combined user stories of all epics'),
    execute: async ({ inputData }) => {
        const userStories = inputData;
        return userStories.flat();
    },
});