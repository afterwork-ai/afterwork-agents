import { basicTaskSchema } from "./basic.task.schema";
import { z } from "zod";


export const taskSchema = basicTaskSchema.extend({
    type: z.literal('task'),
    epicId: z.string().uuid().describe('The epic id of the epic'),
    userStoryId: z.string().uuid().describe('The user story id of the user story'),
    featureId: z.string().uuid().describe('The feature id of the feature'),
    taskId: z.string().uuid().describe('The task id of the task'),
});