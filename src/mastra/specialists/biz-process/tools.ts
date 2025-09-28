import 'dotenv/config';
import { MCPClient } from "@mastra/mcp";
 
export const firecrawlMcpClient = new MCPClient({
  id: "firecrawl-mcp-client",
  servers: {
    firecrawl: {
      url: new URL(`https://mcp.firecrawl.dev/${process.env.FIRECRAWL_API_KEY}/v2/mcp`)
    },
  }
});