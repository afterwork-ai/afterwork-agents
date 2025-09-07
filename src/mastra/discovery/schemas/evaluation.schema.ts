import { z } from 'zod';
import { enrichedIdeaSchema } from './idea.schema';

export const evaluationSchema = z.object({
  score: z.number().describe('The overall score of the idea after analysis from 1 to 5'),
  reasoning: z.string().describe('The reasoning behind the scoring of the idea'),
  strengths: z.array(z.string()).describe('The strengths of the idea'),
  weaknesses: z.array(z.string()).describe('The weaknesses of the idea'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the idea'),
  values: z.object({
    zero_touch: z.number().describe('Evaluation of the idea\'s ability to be executed with no human intervention, from 1 to 5'),
    plg: z.number().describe('Evaluation of the idea\'s focus on product-led growth strategies to drive user acquisition and retention, from 1 to 5'),
    ai_first: z.number().describe('Evaluation of the idea\'s focus on AI technologies to enhance user experience and operational efficiency, from 1 to 5'),
    subscription_based_pricing_model: z.number().describe('Evaluation of the idea\'s focus on subscription-based pricing model for recurring revenue, from 1 to 5'),
  }),
});

export const collectiveEvaluationSchema = z.object({
  enrichedIdea: enrichedIdeaSchema.describe('The enriched idea'),
  evaluations: z.object({
    engineering: evaluationSchema.describe('The evaluation of the idea from the engineering perspective'),
    marketing: evaluationSchema.describe('The evaluation of the idea from the marketing perspective'),
    product: evaluationSchema.describe('The evaluation of the idea from the product perspective'),
    salesops: evaluationSchema.describe('The evaluation of the idea from the salesops perspective'),
  }).describe('The team\'s evaluations of the idea'),
});