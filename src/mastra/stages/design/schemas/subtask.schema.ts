import { basicTaskSchema } from "./basic.task.schema";
import { z } from "zod";


export const subtaskSchema = basicTaskSchema.extend({
    type: z.literal('subtask'),
    epicId: z.string().uuid().describe('The epic id of the epic'),
    userStoryId: z.string().uuid().describe('The user story id of the user story'),
    featureId: z.string().uuid().describe('The feature id of the feature'),
    taskId: z.string().uuid().describe('The task id of the task'),
    subtaskId: z.string().uuid().describe('The subtask id of the subtask'),
});