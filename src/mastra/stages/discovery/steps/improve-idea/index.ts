import { createStep } from '@mastra/core/workflows';
import { collectiveEvaluationSchema, enrichedIdeaSchema } from '../../schemas';
import ideaImprover from '../../specialists/idea.improver';

export default createStep({
  id: 'improve-idea',
  description: 'Improves the idea based on the team\'s evaluation',
  inputSchema: collectiveEvaluationSchema,
  outputSchema: enrichedIdeaSchema,
  execute: async ({ inputData, workflowId, runId, getStepResult }) => {

    // Get the enriched idea and evaluations
    const { enrichedIdea, evaluations } = inputData;
    
    // Generate dynamic thread and resource IDs based on run ID
    const threadId = `${workflowId}-${runId}`;
    const resourceId = `user-${runId}`;

    // Improve the idea based on the team's evaluation
    const response = await ideaImprover.generate([
      { 
        role: 'user', 
        content: `
            Improve the micro-saas idea based on the team's evaluation: 
            
            The idea to improve is:

            ${JSON.stringify(enrichedIdea, null, 2)}

            The team's evaluation is:

            ${JSON.stringify(evaluations, null, 2)}` 
      }
    ], {
      memory: {
        thread: threadId,
        resource: resourceId
      }
    });

    // Parse the response
    const improvedIdea = JSON.parse(response.text);
    // Return the improved idea
    return improvedIdea;
  },
});