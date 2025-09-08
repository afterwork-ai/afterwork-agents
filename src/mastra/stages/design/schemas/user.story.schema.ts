import { basicTaskSchema } from "./basic.task.schema";
import { z } from "zod";


export const userStorySchema = basicTaskSchema.extend({
    type: z.literal('user story'),
    epicId: z.string().uuid().describe('The epic id of the epic'),
    userStoryId: z.string().uuid().describe('The user story id of the user story'),
});