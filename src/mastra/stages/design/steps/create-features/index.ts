import { createStep } from '@mastra/core/workflows';
import scrumMaster from '../../specialists/scrum.master';
import { userStorySchema } from '../../schemas/user.story.schema';
import { featureSchema } from '../../schemas/feature.schema';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export default createStep({
    id: `create-features`,
    description: `Breaks down user story into features`,
    inputSchema: userStorySchema,
    outputSchema: z.array(featureSchema).describe(`detailed breakdown of features for a given user story`),
    execute: async ({ inputData, workflowId, runId }) => {

      // get the user story
      const userStory = inputData;

      const response = await scrumMaster.generate([
        { role: 'user', content: 
          `Break down the user story into features:
           Do not include any low-level tasks, epics or user stories, only features.
          
           The user story is:

          ${JSON.stringify(userStory, null, 2)}` 
        }
      ], {
        memory: {
          thread: `${workflowId}-${runId}`,
          resource: `user-${runId}`
        }
      });

      const features = JSON.parse(response.text)
                        .map((feature: any) => ({
                          ...feature,
                          epicId: userStory.epicId,
                          userStoryId: userStory.userStoryId,
                          featureId: uuidv4(),
                        }));

      return features;
    },
  });



  export const combineFeatures =  createStep({
    id: `combine-features`,
    description: 'Combines all the features from all the user stories',
    inputSchema: z.array(z.array(featureSchema).describe('The list of features of a single user story')).describe('The combined list of features for all user stories'),
    outputSchema: z.array(featureSchema).describe('The combined features of all user stories'),
    execute: async ({ inputData }) => {
        const features = inputData;
        return features.flat();
    },
});