import { BlockPlan } from "../../../plans/block_plan";
import { stmtCode, valueCode } from "../../../codegen";
import { ToolboxCategoryNames } from "../../../toolbox";

/**
 * Registration function.
 */
export function registerBlocks() {
  Object.values(BLOCKS).forEach(b => b.defineBlock());
  Object.values(BLOCKS).forEach(b => b.defineToolboxEntry());
}

/**
 * Additional value types for chat messages.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    ChatMessage: "";
    Array_ChatMessage: "";
  }
}

/**
 * Adds a "Chat" category to the toolbox.
 */
declare module "../../../toolbox" {
  export interface ToolboxCategoryNames {
    chat: "";
  }
}

/**
 * Blocks exported by this module.
 */
export const BLOCKS: Record<string, BlockPlan> = {};

/**
 * Common block definitions
 */
const EXTENDS_DOCUMENT_BLOCK = {
  categories: ["chat"] as (keyof ToolboxCategoryNames)[],
};

//***************************************************************************//

/**
 * Additional value types for chat messages.
 */
declare module "../../../plans/block_plan" {
  export interface ValueTypes {
    ChatMessage_Schema: "";
  }
}

/**
 * A block representing the ChatMessage schema.
 */
export const CHAT_MESSAGE_SCHEMA_BLOCK = new BlockPlan({
  name: "chat_message_schema",
  kind: "value",
  output: "ChatMessage_Schema",
  categories: ["chat"] as (keyof ToolboxCategoryNames)[],
  inputs: [
    {
      name: "_id",
      accepts: ["String"],
    },
    {
      name: "author",
      accepts: ["User"],
    },
    {
      name: "content",
      accepts: ["String"],
    },
    {
      name: "timestamp",
      accepts: ["Number"],
    },
    {
      name: "flavor",
      accepts: ["String"],
    },
    {
      name: "speaker",
      accepts: ["Object"],
    },
    {
      name: "whisper",
      accepts: ["Array_User"],
    },
    {
      name: "blind",
      accepts: ["Boolean"],
    },
    {
      name: "rolls",
      accepts: ["Array_Roll"],
    },
    {
      name: "style",
      accepts: ["String"],
    },
    {
      name: "flags",
      accepts: ["Object"],
    },
    {
      name: "_stats",
      accepts: ["Object"],
    },
  ],
  toCode: valueCode(
    `{
      _id: {{_id}},
      author: {{author}},
      content: {{content}},
      timestamp: {{timestamp}},
      flavor: {{flavor}},
      speaker: {{speaker}},
      whisper: {{whisper}},
      blind: {{blind}},
      rolls: {{rolls}},
      style: {{style}},
      flags: {{flags}},
      _stats: {{_stats}}
    }`,
  ),
});

//***************************************************************************//

/**
 * Create a new Chat Message.
 */
BLOCKS.CHAT_MESSAGE_CREATE = new BlockPlan({
  ...EXTENDS_DOCUMENT_BLOCK,
  name: "chat_message_create",
  kind: "statement",
  inputs: [
    {
      name: "CONTENT",
      accepts: ["String"],
      shadow: { block: "text" },
    },
    {
      name: "OPTIONS",
      accepts: ["Object"],
      shadow: { block: "create_object" },
    },
  ],
  toCode: stmtCode(
    "ChatMessage.create({ content: {{CONTENT}} }, {{OPTIONS}});",
  ),
});

/**
 * Get a Chat Message by its ID.
 */
BLOCKS.CHAT_MESSAGE_GET = new BlockPlan({
  name: "chat_message_get",
  kind: "value",
  categories: ["chat"],
  output: "ChatMessage",
  inputs: [
    {
      name: "MESSAGE_ID",
      accepts: ["String"],
    },
  ],
  toCode: valueCode("game.messages.get({{MESSAGE_ID}})"),
});

/**
 * Update an existing Chat Message.
 */
BLOCKS.CHAT_MESSAGE_UPDATE = new BlockPlan({
  name: "chat_message_update",
  kind: "statement",
  categories: ["chat"],
  inputs: [
    {
      name: "MESSAGE",
      accepts: ["ChatMessage"],
    },
    {
      name: "UPDATES",
      accepts: ["Object"],
      shadow: { block: "create_object" },
    },
  ],
  toCode: stmtCode("{{MESSAGE}}.update({{UPDATES}});"),
});

/**
 * Delete a Chat Message by its ID.
 */
BLOCKS.CHAT_MESSAGE_DELETE = new BlockPlan({
  name: "chat_message_delete",
  kind: "statement",
  categories: ["chat"],
  inputs: [
    {
      name: "MESSAGE_ID",
      accepts: ["String"],
    },
  ],
  toCode: stmtCode("ChatMessage.deleteDocuments([{{MESSAGE_ID}}]);"),
});
