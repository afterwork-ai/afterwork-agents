import { basicTaskSchema } from "./basic.task.schema";
import { z } from "zod";

export const epicSchema = basicTaskSchema.extend({
    type: z.literal('epic'),
    epicId: z.string().uuid().describe('The epic id of the epic'),
});