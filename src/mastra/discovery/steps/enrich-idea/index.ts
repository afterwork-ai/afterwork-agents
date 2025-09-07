import { createStep } from '@mastra/core/workflows';
import { enrichedIdeaSchema, rawIdeaSchema } from '../../schemas';
import ideaEnricher from '../../specialists/idea.enricher';

export default createStep({
    id: 'enrich-idea',
    description: 'Enriches business idea with additional information',
    inputSchema: rawIdeaSchema,
    outputSchema: enrichedIdeaSchema,
    execute: async ({ inputData }) => {
      // get the raw idea
      const { rawIdea } = inputData;
  
      if (!rawIdea) {
        throw new Error('Raw idea was not found');
      }
  
      /*
      const prompt = `Based on the following weather forecast for ${forecast.location}, suggest appropriate activities:
        ${JSON.stringify(forecast, null, 2)}
        `;
      */
  
      const response = await ideaEnricher.generate([
        {
          role: 'user',
          content: rawIdea,
        },
      ]);
  
      return JSON.parse(response.text);
    },
  });