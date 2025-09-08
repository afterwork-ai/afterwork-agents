import { basicTaskSchema } from "./basic.task.schema";
import { z } from "zod";


export const featureSchema = basicTaskSchema.extend({
    type: z.literal('feature'),
    epicId: z.string().uuid().describe('The epic id of the epic'),
    userStoryId: z.string().uuid().describe('The user story id of the user story'),
    featureId: z.string().uuid().describe('The feature id of the feature'),
});