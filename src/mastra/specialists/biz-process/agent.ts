import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { memory } from '../../utils/memory';
import instructions from './instructions';
import { firecrawlMcpClient } from './tools';

export default new Agent({
  name: 'BizProcess-KPI Extractor',
  instructions,
  model: openai('gpt-5'),
  memory,
  tools: await firecrawlMcpClient.getTools(),
});