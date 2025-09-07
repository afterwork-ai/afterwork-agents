import { createStep } from '@mastra/core/workflows';
import { evaluationSchema, enrichedIdeaSchema, collectiveEvaluationSchema } from '../../schemas';
import { getSpecialist, SpecialistName } from '../../specialists/specialist.factory';
import { z } from 'zod';
import enrichIdeaStep from '../enrich-idea';

export const generateEvaluationStep = (specialistName: SpecialistName) => {
  return createStep({
    id: `evaluate-${specialistName}`,
    description: `Evaluates a micro-saas idea from the ${specialistName} perspective`,
    inputSchema: enrichedIdeaSchema,
    outputSchema: evaluationSchema,
    execute: async ({ inputData, workflowId, runId }) => {
      const enrichedIdea = inputData;

      const specialist = getSpecialist(specialistName);

      if (!specialist) {
        throw new Error(`Specialist ${specialistName} not found`);
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

export const synthesizeEvaluationsStep = createStep({
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