import { z } from 'zod';

export const basicTaskSchema = z.object({
    name: z.string().describe('The name of the task'),
    type: z.enum(['epic', 'user story', 'feature', 'task', 'subtask']).describe('The type of the task'),
    domain: z.enum(['engineering', 'marketing', 'product', 'salesops']).describe('The domain of the task'),
    description: z.string().describe('The description of the task'),
    tags: z.array(z.string()).describe('The tags of the task'),
    dependencies: z.array(z.string()).describe('The dependencies of the task'),
    comments: z.array(z.string()).describe('The comments of the task'),
  });
