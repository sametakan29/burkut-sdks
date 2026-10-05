#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BurkutApiClient } from './client.js';
import { TOOLS } from './tools.js';
import { getConfig } from './config.js';

async function main() {
  const config = getConfig();
  const client = new BurkutApiClient(config);

  const server = new Server(
    {
      name: 'burkut-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools list
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = TOOLS.find((t) => t.name === name);

    if (!tool) {
      return {
        content: [
          {
            type: 'text',
            text: `Tool '${name}' is not recognized by burkut-mcp server.`,
          },
        ],
        isError: true,
      };
    }

    try {
      const output = await tool.handler(client, args || {});
      return {
        content: [
          {
            type: 'text',
            text: output,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing '${name}': ${error.message || String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr (never stdout, as stdout is reserved for JSON-RPC in stdio transport)
  console.error(`[burkut-mcp] Server running on stdio (Target API: ${config.baseUrl})`);
  if (config.apiKey) {
    console.error(`[burkut-mcp] API Key configured: ${config.apiKey.slice(0, 6)}...`);
  } else {
    console.error(`[burkut-mcp] Running in public mode (No BURKUT_API_KEY provided)`);
  }
}

main().catch((err) => {
  console.error('[burkut-mcp] Fatal error:', err);
  process.exit(1);
});
