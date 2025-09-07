import { z } from 'zod';

export const rawIdeaSchema = z.object({
  rawIdea: z.string().describe('The raw business idea'),
});

export const enrichedIdeaSchema = z.object({
  description: z.string().describe('The description of the idea'),
  problem: z.string().describe('The problem the idea solves'),
  solution: z.string().describe('The solution the idea provides'),
  market: z.string().describe('The market the idea targets'),
  ideal_customer_profile: z.string().describe('The ideal customer profile the idea targets'),
  go_to_market_strategy: z.string().describe('The go-to-market strategy the idea uses'),
  pricing_model: z.string().describe('The pricing model the idea uses'),
  distribution_channels: z.array(z.string()).describe('The distribution channels the idea uses'),
  key_metrics: z.array(z.string()).describe('The key metrics the idea tracks'),
  unique_value_proposition: z.string().describe('The unique value proposition the idea offers'),
  competitive_advantage: z.string().describe('The competitive advantage the idea has'),
  core_features: z.array(z.string()).describe('The core features the idea has'),
  tech_stack: z.array(z.string()).describe('The technical stack the idea uses'),
});