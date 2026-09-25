import { createSdkMcpServer, query, tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import {
  approveDirectoryListing,
  listDirectoryCandidates,
  prepareDirectoryListing,
  submitApprovedDirectoryListing,
} from './off-page-seo.js';

const SYSTEM_PROMPT = `\
You are a friendly Slack assistant with a specialist workflow for ethical off-page SEO.
When the user asks about directory listings, backlinks, citations, or off-page SEO for \
anyfilex.com, use the directory tools instead of inventing directories or submission results.

## OFF-PAGE SEO WORKFLOW
- Start with a short, relevant directory shortlist. Prefer genuine topical or product fit over volume.
- Prepare one listing packet at a time with accurate, non-spammy copy.
- Always show the packet and leave it in 'awaiting_approval' until the user explicitly approves its request ID.
- Only then call the approval tool. Approval does not mean submission: never claim a directory accepted or published a listing.
- Do not recommend link farms, paid-link schemes, duplicate submissions, fake reviews, keyword stuffing, or automated spam.
- If a directory's current requirements are unknown, say so and direct the user to verify them on the directory.
- Submission requires a separately reviewed connector and an exact final confirmation in the form 'SUBMIT <request ID>'.
- Never use submission tools without showing the exact packet and asking the user for that final confirmation.

For general requests, remain a friendly Slack assistant. \

## PERSONALITY
- Friendly, helpful, and approachable
- Lightly witty — a touch of humor when appropriate, but never forced
- Concise and clear — respect people's time
- Confident but honest when you don't know something

## RESPONSE GUIDELINES
- Keep responses to 3 sentences max — be punchy, scannable, and actionable
- End with a clear next step on its own line so it's easy to spot
- Use a bullet list only for multi-step instructions
- Use casual, conversational language
- Use emoji sparingly — at most one per message, and only to set tone

## FORMATTING RULES
- Use standard Markdown syntax: **bold**, _italic_, \`code\`, \`\`\`code blocks\`\`\`, > blockquotes
- Use bullet points for multi-step instructions

## EMOJI REACTIONS
Always react to every user message with \`add_emoji_reaction\` before responding. \
Pick any Slack emoji that reflects the *topic* or *tone* of the message — be creative and specific \
(e.g. \`dog\` for dog topics, \`books\` for learning, \`wave\` for greetings). \
Vary your picks across a thread; don't repeat the same emoji.

## SLACK MCP SERVER
You may have access to the Slack MCP Server, which gives you powerful Slack tools \
beyond your built-in tools. Use them whenever they would help the user.

Available capabilities:
- **Search**: Search messages and files across public channels, search for channels by name
- **Read**: Read channel message history, read thread replies, read canvas documents
- **Write**: Send messages, create draft messages, schedule messages for later
- **Canvases**: Create, read, and update Slack canvas documents

Use these tools when they can help answer a question or complete a task — for example, \
searching for relevant messages, checking a channel for context, or creating a canvas. \
Also use them when the user explicitly asks you to perform a Slack action.`;

const EMOJI_DESCRIPTION =
  "Add an emoji reaction to the user's current message to acknowledge the topic.\n\n" +
  'Use any standard Slack emoji that matches the topic or tone of the message. ' +
  'Be creative and specific — if someone mentions a dog, use `dog`; if they sound ' +
  'frustrated, use `sweat_smile`. The examples below are common picks, not the full set:\n' +
  '- Gratitude/praise: pray, bow, blush, sparkles, star-struck, heart\n' +
  '- Frustration/confusion: thinking_face, face_with_monocle, sweat_smile, upside_down_face\n' +
  '- Something broken: wrench, hammer_and_wrench, mag\n' +
  '- Performance/slow: hourglass_flowing_sand, snail\n' +
  '- Urgency: rotating_light, zap, fire\n' +
  '- Success/celebration: tada, raised_hands, partying_face, rocket, muscle\n' +
  '- Setup/config: gear, package\n' +
  '- Network/connectivity: satellite, signal_strength\n' +
  '- Agreement/acknowledgment: thumbsup, ok_hand, saluting_face, +1';

/** @type {string[]} */
const ALLOWED_TOOLS = [
  'add_emoji_reaction',
  'list_directory_candidates',
  'prepare_directory_listing',
  'approve_directory_listing',
  'submit_directory_listing',
];

const SLACK_MCP_URL = 'https://mcp.slack.com/mcp';

/**
 * @typedef {Object} AgentDeps
 * @property {import('@slack/web-api').WebClient} client
 * @property {string} userId
 * @property {string} channelId
 * @property {string} threadTs
 * @property {string} messageTs
 * @property {string} [userToken]
 * @property {Record<string, (packet: object) => Promise<object>>} [directoryConnectors]
 */

/**
 * Run the agent with the given text and optional session ID.
 * @param {string} text - The user's message text.
 * @param {string} [sessionId] - An existing session ID to resume conversation.
 * @param {AgentDeps} [deps] - Dependencies for tools that need Slack API access.
 * @returns {Promise<{responseText: string, sessionId: string | null}>}
 */
export async function runAgent(text, sessionId = undefined, deps = undefined) {
  const addEmojiReactionTool = tool(
    'add_emoji_reaction',
    EMOJI_DESCRIPTION,
    { emoji_name: z.string().describe("The Slack emoji name without colons (e.g. 'tada', 'wrench', 'pray').") },
    async ({ emoji_name }) => {
      if (!deps) {
        return { content: [{ type: 'text', text: 'No deps available to add reaction.' }] };
      }

      // Skip ~15% of reactions to feel more natural
      if (Math.random() < 0.15) {
        return {
          content: [
            { type: 'text', text: `Skipped :${emoji_name}: reaction (randomly omitted to avoid over-reacting)` },
          ],
        };
      }

      try {
        await deps.client.reactions.add({
          channel: deps.channelId,
          timestamp: deps.messageTs,
          name: emoji_name,
        });
        return { content: [{ type: 'text', text: `Reacted with :${emoji_name}:` }] };
      } catch (e) {
        const err = /** @type {any} */ (e);
        return { content: [{ type: 'text', text: `Could not add reaction: ${err.data?.error || err.message}` }] };
      }
    },
  );

  const listDirectoryCandidatesTool = tool(
    'list_directory_candidates',
    'Return relevant, curated directory candidates for ethical off-page SEO research.',
    {
      category: z.string().optional().describe('A topical filter such as software, product, or startup.'),
      min_fit: z.enum(['Medium', 'High']).optional().describe('Minimum relevance fit. Defaults to Medium.'),
    },
    async ({ category, min_fit }) => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(listDirectoryCandidates({ category, minFit: min_fit }), null, 2),
        },
      ],
    }),
  );

  const prepareDirectoryListingTool = tool(
    'prepare_directory_listing',
    'Create an approval-gated listing packet for anyfilex.com.',
    {
      directory_id: z.string().describe('The ID returned by list_directory_candidates.'),
      contact_email: z.string().email().optional().describe('Optional public contact email for the listing.'),
      site: z
        .object({
          name: z.string().optional(),
          url: z.string().url().optional(),
          description: z.string().min(40).max(500).optional(),
          categories: z.array(z.string()).optional(),
          tags: z.array(z.string()).optional(),
        })
        .optional()
        .describe('Optional reviewed overrides for the default AnyFileX listing details.'),
    },
    async ({ directory_id, contact_email, site }) => {
      try {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                prepareDirectoryListing({ directoryId: directory_id, contactEmail: contact_email, site }),
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text', text: `Could not prepare listing: ${message}` }] };
      }
    },
  );

  const approveDirectoryListingTool = tool(
    'approve_directory_listing',
    'Approve a previously prepared listing packet. This never claims that a directory submission succeeded.',
    { request_id: z.string().describe('The request ID shown in the listing packet.') },
    async ({ request_id }) => {
      try {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(approveDirectoryListing(request_id), null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text', text: `Could not approve listing: ${message}` }] };
      }
    },
  );

  const submitDirectoryListingTool = tool(
    'submit_directory_listing',
    'Submit an approved listing through a configured, directory-specific connector after final confirmation.',
    {
      request_id: z.string().describe('The approved listing request ID.'),
      confirmation: z
        .string()
        .describe('Must exactly match SUBMIT followed by the request ID, for example SUBMIT seo-123-ab12cd.'),
    },
    async ({ request_id, confirmation }) => {
      try {
        const result = await submitApprovedDirectoryListing({
          requestId: request_id,
          confirmation,
          connectors: deps?.directoryConnectors,
        });
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text', text: `Could not submit listing: ${message}` }] };
      }
    },
  );

  const agentToolsServer = createSdkMcpServer({
    name: 'agent-tools',
    version: '1.0.0',
    tools: [
      addEmojiReactionTool,
      listDirectoryCandidatesTool,
      prepareDirectoryListingTool,
      approveDirectoryListingTool,
      submitDirectoryListingTool,
    ],
  });

  /** @type {Record<string, any>} */
  const mcpServers = { 'agent-tools': agentToolsServer };
  const allowedTools = [...ALLOWED_TOOLS];

  if (deps?.userToken) {
    mcpServers['slack-mcp'] = {
      type: 'http',
      url: SLACK_MCP_URL,
      headers: { Authorization: `Bearer ${deps.userToken}` },
    };
    allowedTools.push('mcp__slack-mcp__*');
  }

  /** @type {import('@anthropic-ai/claude-agent-sdk').Options} */
  const options = {
    systemPrompt: SYSTEM_PROMPT,
    mcpServers,
    allowedTools,
    permissionMode: 'bypassPermissions',
    ...(sessionId && { resume: sessionId }),
  };

  const responseParts = [];
  let newSessionId = null;

  for await (const message of query({ prompt: text, options })) {
    if (message.type === 'assistant') {
      for (const block of message.message.content) {
        if (block.type === 'text') {
          responseParts.push(block.text);
        }
      }
    }
    if (message.type === 'result') {
      newSessionId = message.session_id;
    }
  }

  const responseText = responseParts.join('\n');
  return { responseText, sessionId: newSessionId };
}
