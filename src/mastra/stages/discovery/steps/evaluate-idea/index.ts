import { createStep } from '@mastra/core/workflows';
import { evaluationSchema, enrichedIdeaSchema, collectiveEvaluationSchema } from '../../schemas';
import { getEvaluationSpecialist, DomainName } from '../../../../common/specialist.factory';
import { z } from 'zod';
import enrichIdeaStep from '../enrich-idea';

export const generateEvaluation = (domainName: DomainName) => {
  return createStep({
    id: `evaluate-${domainName}`,
    description: `Evaluates a micro-saas idea from the ${domainName} perspective`,
    inputSchema: enrichedIdeaSchema,
    outputSchema: evaluationSchema,
    execute: async ({ inputData, workflowId, runId }) => {
      const enrichedIdea = inputData;

      const specialist = getEvaluationSpecialist(domainName);

      if (!specialist) {
        throw new Error(`Specialist ${domainName} not found`);
      }

      const response = await specialist.generate([
        { role: 'user', content: 
          `Evaluate this idea:
          
          ${JSON.stringify(enrichedIdea, null, 2)}` 
        }
      ], {
        memory: {
          thread: `${workflowId}-${runId}`,
          resource: `user-${runId}`
        }
      });

      return JSON.parse(response.text);
    },
  });
};

export const synthesizeEvaluations = createStep({
  id: 'synthesize-evaluations',
  description: 'Synthesizes the team\'s evaluations of the idea',
  inputSchema: z.object({
    'evaluate-engineering': evaluationSchema,
    'evaluate-marketing': evaluationSchema,
    'evaluate-salesops': evaluationSchema,
    'evaluate-product': evaluationSchema,
  }),
  outputSchema: collectiveEvaluationSchema,
  execute: async ({ inputData, getStepResult }) => {

    const evaluations = inputData;

    return {
      enrichedIdea: getStepResult(enrichIdeaStep),
      evaluations: {
        engineering: evaluations["evaluate-engineering"],
        product: evaluations["evaluate-product"],
        marketing: evaluations["evaluate-marketing"],
        salesops: evaluations["evaluate-salesops"],
      },
    };
  },
});