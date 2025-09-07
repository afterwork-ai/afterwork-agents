import { createStep } from '@mastra/core/workflows';
import { enrichedIdeaSchema, rawIdeaSchema } from '../../schemas';
import ideaEnricher from '../../specialists/idea.enricher';

const enrichIdeaStep = createStep({
    id: 'enrich-idea',
    description: 'Enriches business idea with additional information',
    inputSchema: rawIdeaSchema,
    outputSchema: enrichedIdeaSchema,
  execute: async ({ inputData, workflowId, runId }) => {
    // get the raw idea
    const { rawIdea } = inputData;

    if (!rawIdea) {
      throw new Error('Raw idea was not found');
    }

    const response = await ideaEnricher.generate([
      {
        role: 'user',
        content: rawIdea,
      },
    ], {
      memory: {
        thread: `${workflowId}-${runId}`,
        resource: `user-${runId}`
      }
    });

    return JSON.parse(response.text);
  },
  });

export default enrichIdeaStep;