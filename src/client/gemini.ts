import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function convertMcpToolsToGemini(mcpTools: any[]) {
    return mcpTools.map((tool) => ({
        name: tool.name,
        description: tool.description || '',
        parameters: tool.inputSchema || { type: 'object', properties: {} },
    }));
}

async function runAgent(userPrompt: string) {
    console.log(`\n🤖 User Prompt: "${userPrompt}"\n`);

    const transport = new StdioClientTransport({
        command: 'node',
        args: ['./dist/index.js'],
    });

    const mcpClient = new Client(
        { name: 'parabank-gemini-client', version: '1.0.0' },
        { capabilities: {} }
    );

    try {
        await mcpClient.connect(transport);
        console.log('✅ Connected to MCP Server');

        const mcpToolsResponse = await mcpClient.listTools();
        const functionDeclarations = convertMcpToolsToGemini(mcpToolsResponse.tools);
        console.log(`🛠️ Loaded ${functionDeclarations.length} MCP tool(s) for Gemini.`);

        const model = 'gemini-3.6-flash';

        // 1. Initial Prompt
        const initialResponse = await ai.models.generateContent({
            model,
            contents: userPrompt,
            config: {
                tools: [{ functionDeclarations }],
            },
        });

        const functionCalls = initialResponse.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
            console.log(`\n⚡ Gemini requested ${functionCalls.length} tool call(s).`);

            const functionResponseParts: any[] = [];

            // 2. Execute all requested tool calls
            for (const call of functionCalls) {
                console.log(`\n▶️ Executing [${call.name}] with args:`, JSON.stringify(call.args, null, 2));

                const executionResult = await mcpClient.callTool({
                    name: call.name ?? '',
                    arguments: (call.args as Record<string, any>) || {},
                });

                // Parse text content string back into JSON if applicable so Gemini gets structured data
                let parsedOutput: any = executionResult.content;
                if (
                    Array.isArray(executionResult.content) &&
                    executionResult.content[0]?.type === 'text'
                ) {
                    try {
                        parsedOutput = JSON.parse(executionResult.content[0].text);
                    } catch {
                        parsedOutput = executionResult.content[0].text;
                    }
                }

                functionResponseParts.push({
                    functionResponse: {
                        name: call.name,
                        response: { output: parsedOutput },
                    },
                });
            }

            // 3. Extract pure candidate parts array
            const modelParts = initialResponse.candidates?.[0]?.content?.parts || [];

            // 4. Send follow-up request with role 'function' or explicitly structured turns
            const followUpResponse = await ai.models.generateContent({
                model,
                contents: [
                    { role: 'user', parts: [{ text: userPrompt }] },
                    { role: 'model', parts: modelParts },
                    { role: 'user', parts: functionResponseParts },
                ],
            });

            const finalCandidate = followUpResponse.candidates?.[0];
            const textPart = finalCandidate?.content?.parts?.find((p: any) => p.text);

            if (textPart?.text) {
                console.log(`\n💬 Gemini Final Response:\n${textPart.text}`);
            } else if (followUpResponse.text) {
                console.log(`\n💬 Gemini Final Response:\n${followUpResponse.text}`);
            } else {
                console.log(`\n💬 Raw Response Structure:\n`, JSON.stringify(finalCandidate, null, 2));
            }
        } else {
            console.log(`\n💬 Gemini Response:\n${initialResponse.text}`);
        }
    } catch (error) {
        console.error('❌ Error during execution:', error);
    } finally {
        await transport.close();
        console.log('\n🔒 MCP Server Connection Closed');
    }
}

const prompt = process.argv[2] || 'What is the balance for account 13122?';
runAgent(prompt);