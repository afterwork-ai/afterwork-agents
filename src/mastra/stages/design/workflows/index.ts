import { z } from 'zod';
import { createWorkflow } from '@mastra/core/workflows';
import { enrichedIdeaSchema } from '../../discovery/schemas';
import { taskSchema } from '../schemas';
import createEpics from '../steps/create-epics';
import createUserStories, { combineUserStories } from '../steps/create-user-stories';
import createFeatures, { combineFeatures } from '../steps/create-features';
import createTasksStep, { combineTasks } from '../steps/create-tasks';
import createSubtasksStep, { combineSubtasks } from '../steps/create-subtasks';

export const productDesignWorkflow = createWorkflow({
    id: 'product-design-workflow',
    inputSchema: enrichedIdeaSchema,
    outputSchema: z.array(taskSchema).describe('The list of low-level actionable engineering tasks for the micro-saas idea')
})
.then(createEpics)
.foreach(createUserStories)
.then(combineUserStories)
.foreach(createFeatures)
.then(combineFeatures)
.foreach(createTasksStep)
.then(combineTasks)
.foreach(createSubtasksStep)
.then(combineSubtasks)
.commit();