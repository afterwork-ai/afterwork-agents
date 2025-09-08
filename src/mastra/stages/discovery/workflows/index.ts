import { createWorkflow } from '@mastra/core/workflows';
import { rawIdeaSchema, enrichedIdeaSchema } from '../schemas';
import enrichIdea from '../steps/enrich-idea';
import{ generateEvaluation, synthesizeEvaluations } from '../steps/evaluate-idea';
import improveIdea from '../steps/improve-idea';


const evaluate = [
    generateEvaluation('engineering'),
    generateEvaluation('marketing'),
    generateEvaluation('salesops'),
    generateEvaluation('product'),
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
.then(enrichIdea)
.parallel(evaluate)
 // @ts-ignore
.then(synthesizeEvaluations)
.then(improveIdea)
.commit();


export const iterateWorkflow = createWorkflow({
    id: 'iterate-workflow',
    inputSchema: enrichedIdeaSchema,
    outputSchema: enrichedIdeaSchema
})
.parallel(evaluate)
// @ts-ignore
.then(synthesizeEvaluations)
.then(improveIdea)
.commit();