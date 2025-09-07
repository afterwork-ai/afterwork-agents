import { createStep } from '@mastra/core/workflows';
import { collectiveEvaluationSchema, enrichedIdeaSchema } from '../../schemas';
import ideaImprover from '../../specialists/idea.improver';

export default createStep({
  id: 'improve-idea',
  description: 'Improves the idea based on the team\'s evaluation',
  inputSchema: collectiveEvaluationSchema,
  outputSchema: enrichedIdeaSchema,
  execute: async ({ inputData }) => {
    const { enrichedIdea, evaluations } = inputData;

    // Improve the idea based on the team's evaluation
    const response = await ideaImprover.generate([
      { 
        role: 'user', 
        content: `
            Improve the micro-saas idea based on the team's evaluation: 
            
            The idea to improve is:

            ${JSON.stringify(enrichedIdea)}

            The team's evaluation is:

            ${JSON.stringify(evaluations)}` 
      }
    ]);

    // Parse the response
    const improvedIdea = JSON.parse(response.text);
    // Return the improved idea
    return improvedIdea;
  },
});