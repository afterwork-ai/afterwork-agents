import { createWorkflow } from '@mastra/core/workflows';
import { rawIdeaSchema, enrichedIdeaSchema } from '../discovery/schemas';
import enrichIdeaStep from '../discovery/steps/enrich-idea';
import evaluateInParallelStep from '../discovery/steps/evaluate-in-parallel';
import improveIdeaStep from '../discovery/steps/improve-idea';

/*
    1. Idea Enrichment
    2. Parallel Evaluation
    3. Evaluation Synthesizer
    4. Parallel Evaluation
    5. Evaluation Synthesizer
*/
export default createWorkflow
({
    id: 'discovery-workflow',
    inputSchema: rawIdeaSchema,
    outputSchema: enrichedIdeaSchema
}).then(
    enrichIdeaStep
).then(
    evaluateInParallelStep
).then(
    improveIdeaStep
).then(
    evaluateInParallelStep
).then(
    improveIdeaStep
);