import { createWorkflow } from '@mastra/core/workflows';
import { rawIdeaSchema, enrichedIdeaSchema } from '../discovery/schemas';
import enrichIdeaStep from '../discovery/steps/enrich-idea';
import{ generateEvaluationStep, synthesizeEvaluationsStep } from '../discovery/steps/evaluate-idea';
import improveIdeaStep from '../discovery/steps/improve-idea';


const evaluateSteps = [
    generateEvaluationStep('engineering'),
    generateEvaluationStep('marketing'),
    generateEvaluationStep('salesops'),
    generateEvaluationStep('product'),
];

/*
    Workflow Steps:
    1. Idea Enrichment
    2. Parallel Evaluation
    3. Evaluation Synthesizer
    4. Parallel Evaluation
    5. Evaluation Synthesizer
    6. Idea Improvement
*/
export const discoveryWorkflow = createWorkflow({
    id: 'discovery-workflow',
    inputSchema: rawIdeaSchema,
    outputSchema: enrichedIdeaSchema
})
.then(enrichIdeaStep)
.parallel(evaluateSteps)
 // @ts-ignore
.then(synthesizeEvaluationsStep)
.then(improveIdeaStep)
.commit();


export const iterateWorkflow = createWorkflow({
    id: 'iterate-workflow',
    inputSchema: enrichedIdeaSchema,
    outputSchema: enrichedIdeaSchema
})
.parallel(evaluateSteps)
// @ts-ignore
.then(synthesizeEvaluationsStep)
.then(improveIdeaStep)
.commit();