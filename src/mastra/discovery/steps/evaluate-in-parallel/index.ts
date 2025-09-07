import { createStep } from '@mastra/core/workflows';
import { collectiveEvaluationSchema, enrichedIdeaSchema } from '../../schemas';
import engineeringResearcher from '../../specialists/engineering.evaluator';
import marketingResearcher from '../../specialists/marketing.evaluator';
import pmResearcher from '../../specialists/pm.evaluator';
import salesopsResearcher from '../../specialists/salesops.evaluator';

export default createStep({
  id: 'evaluate-in-parallel',
  description: 'Runs multiple idea evaluations in parallel',
  inputSchema: enrichedIdeaSchema,
  outputSchema: collectiveEvaluationSchema,
  execute: async ({ inputData }) => {
    const enrichedIdea = inputData;

    // PARALLEL EXECUTION - All evaluations run simultaneously
    const [engineeringResult, marketingResult, productResult, salesopsResult] = await Promise.all([
      engineeringResearcher.generate([
        { role: 'user', content: `Evaluate this idea: ${JSON.stringify(enrichedIdea)}` }
      ]),
      marketingResearcher.generate([
        { role: 'user', content: `Evaluate this idea: ${JSON.stringify(enrichedIdea)}` }
      ]),
      pmResearcher.generate([
        { role: 'user', content: `Evaluate this idea: ${JSON.stringify(enrichedIdea)}` }
      ]),
      salesopsResearcher.generate([
        { role: 'user', content: `Evaluate this idea: ${JSON.stringify(enrichedIdea)}` }
      ])
    ]);

    // Parse results and combine
    const evaluations = {
      engineering: JSON.parse(engineeringResult.text),
      marketing: JSON.parse(marketingResult.text),
      product: JSON.parse(productResult.text),
      salesops: JSON.parse(salesopsResult.text),
    };

    return {
      enrichedIdea,
      evaluations,
    };
  },
});