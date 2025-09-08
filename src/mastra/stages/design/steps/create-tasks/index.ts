import { createStep } from '@mastra/core/workflows';
import { featureSchema } from '../../schemas/feature.schema';
import { taskSchema } from '../../schemas/task.schema';
import scrumMaster from '../../specialists/scrum.master';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export default createStep({
    id: `create-tasks`,
    description: `Breaks down a feature into tasks`,
    inputSchema: featureSchema,
    outputSchema: z.array(taskSchema).describe(`low-level detailed breakdown of tasks for a given product feature`),
    execute: async ({ inputData, workflowId, runId }) => {

      // get the feature
      const feature = inputData;

      const response = await scrumMaster.generate([
        { role: 'user', content: 
          `Break down the feature into tasks.
           Do not include any epics, user stories or features, only tasks.

           The feature is:

          ${JSON.stringify(feature, null, 2)}` 
        }
      ], {
        memory: {
          thread: `${workflowId}-${runId}`,
          resource: `user-${runId}`
        }
      });

      const tasks = JSON.parse(response.text)
                        .map((task: any) => ({
                          ...task,
                          epicId: feature.epicId,
                          userStoryId: feature.userStoryId,
                          featureId: feature.featureId,
                          taskId: uuidv4(),
                        }));

      return tasks;
    },
  });


  export const combineTasks =  createStep({
    id: `combine-tasks`,
    description: 'Combines all the tasks from all the features',
    inputSchema: z.array(z.array(taskSchema).describe('The list of tasks of a single feature')).describe('The combined list of tasks for all features'),
    outputSchema: z.array(taskSchema).describe('The combined tasks of all features'),
    execute: async ({ inputData }) => {
        const tasks = inputData;
        return tasks.flat();
    },
});