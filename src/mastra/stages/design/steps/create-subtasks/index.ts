import { createStep } from '@mastra/core/workflows';
import { taskSchema, subtaskSchema } from '../../schemas';
import engineeringTasker from '../../specialists/engineering.tasker';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export default createStep({
    id: `create-subtasks`,
    description: `Breaks down a product task into engineering subtasks`,
    inputSchema: taskSchema,
    outputSchema: z.array(subtaskSchema).describe(`low-level detailed breakdown of engineering tasks for a given product task`),
    execute: async ({ inputData, workflowId, runId }) => {

      // get the task
      const task = inputData;

      const response = await engineeringTasker.generate([
        { role: 'user', content: 
          `Break down the product task into engineering subtasks:
           Do not include any epics, user stories features or tasks, only engineering subtasks.

           The product task is:
          
          ${JSON.stringify(task, null, 2)}` 
        }
      ], {
        memory: {
          thread: `${workflowId}-${runId}`,
          resource: `user-${runId}`
        }
      });

      const subtasks = JSON.parse(response.text)
                        .map((subtask: any) => ({
                          ...subtask,
                          epicId: task.epicId,
                          userStoryId: task.userStoryId,
                          featureId: task.featureId,
                          taskId: task.taskId,
                          subtaskId: uuidv4(),
                        }));

      return subtasks;
    },
  });


  export const combineSubtasks =  createStep({
    id: `combine-subtasks`,
    description: 'Combines all the subtasks from all the tasks',
    inputSchema: z.array(z.array(subtaskSchema).describe('The list of subtasks of a single task')).describe('The combined list of subtasks for all tasks'),
    outputSchema: z.array(subtaskSchema).describe('The combined subtasks of all tasks'),
    execute: async ({ inputData }) => {
        const subtasks = inputData;
        return subtasks.flat();
    },
});