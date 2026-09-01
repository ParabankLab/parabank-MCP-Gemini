import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { Tool as McpTool } from '@modelcontextprotocol/sdk/types.js';
import { FunctionDeclaration, Type } from '@google/genai';

/**
 * Converts MCP JSON schema types to Gemini API Schema Types
 */
function mapJsonTypeToGeminiType(type?: string): Type {
  switch (type?.toLowerCase()) {
    case 'string': return Type.STRING;
    case 'number': return Type.NUMBER;
    case 'integer': return Type.INTEGER;
    case 'boolean': return Type.BOOLEAN;
    case 'array': return Type.ARRAY;
    case 'object': return Type.OBJECT;
    default: return Type.STRING;
  }
}

/**
 * Transforms an array of MCP Tools into Gemini Function Declarations
 */
export function convertMcpToolsToGemini(mcpTools: McpTool[]): FunctionDeclaration[] {
  return mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? '',
    parameters: {
      type: Type.OBJECT,
      properties: Object.entries(tool.inputSchema.properties || {}).reduce((acc, [key, schema]: [string, any]) => {
        acc[key] = {
          type: mapJsonTypeToGeminiType(schema.type),
          description: schema.description || '',
        };
        return acc;
      }, {} as Record<string, any>),
      required: tool.inputSchema.required || [],
    },
  }));
}