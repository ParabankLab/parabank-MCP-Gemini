import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// 1. Initialize GoogleGenAI SDK with environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Helper: Converts MCP Tool definitions to Gemini's expected FunctionDeclaration format
 */
function convertMcpToolsToGemini(mcpTools: any[]) {
    return mcpTools.map((tool) => ({
        name: tool.name,
        description: tool.description || '',
        parameters: tool.inputSchema || { type: 'object', properties: {} },
    }));
}

async function runAgent(userPrompt: string) {
    console.log(`\n🤖 User Prompt: "${userPrompt}"\n`);

    // 2. Connect to your compiled MCP server process via stdio
    const transport = new StdioClientTransport({
        command: 'node',
        args: ['./dist/index.js'], // Ensure this path points to your built MCP server file
    });

    const mcpClient = new Client(
        { name: 'parabank-gemini-client', version: '1.0.0' },
        { capabilities: {} }
    );

    try {
        await mcpClient.connect(transport);
        console.log('✅ Connected to MCP Server');

        // 3. Discover available tools from the MCP server
        const mcpToolsResponse = await mcpClient.listTools();
        const functionDeclarations = convertMcpToolsToGemini(mcpToolsResponse.tools);
        console.log(`🛠️ Loaded ${functionDeclarations.length} MCP tool(s) for Gemini.`);

        // 4. Send request to Gemini Flash with function declarations registered
        const model = 'gemini-3.6-flash';
        const response = await ai.models.generateContent({
            model,
            contents: userPrompt,
            config: {
                tools: [{ functionDeclarations }],
            },
        });

        // 5. Inspect if Gemini decided to invoke a function
        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
            for (const call of functionCalls) {
                console.log(`\n⚡ Gemini requested tool call: [${call.name}]`);
                console.log(`📦 Arguments:`, JSON.stringify(call.args, null, 2));

                // 6. Execute tool via MCP client
                const executionResult = await mcpClient.callTool({
                    name: call.name ?? '',
                    arguments: (call.args as Record<string, any>) || {},
                });

                console.log(`\n🎯 MCP Tool Execution Output:`);
                console.log(JSON.stringify(executionResult, null, 2));
            }
        } else {
            // Direct text response if no tool call was triggered
            console.log(`\n💬 Gemini Response:\n${response.text}`);
        }
    } catch (error) {
        console.error('❌ Error during execution:', error);
    } finally {
        // 7. Clean up connection
        await transport.close();
        console.log('\n🔒 MCP Server Connection Closed');
    }
}

// Quick Execution Test
const prompt = process.argv[2] || 'Run the e2e test suite and get consumer metrics.';
runAgent(prompt);