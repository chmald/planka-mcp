/**
 * Core tools - Essential for basic Kanban operations (always enabled)
 */
import { GroupedToolDefinition } from "../types.js";
import {
  authTool,
  projectsTool,
  boardsTool,
  listsTool,
  cardsTool,
  commentsTool,
  tasksTool,
  labelsTool,
  cardMembersTool,
  bootstrapTool,
} from "./tools.js";

export {
  authTool,
  projectsTool,
  boardsTool,
  listsTool,
  cardsTool,
  commentsTool,
  tasksTool,
  labelsTool,
  cardMembersTool,
  bootstrapTool,
};

/**
 * All core tools combined
 */
export const coreTools: GroupedToolDefinition[] = [
  authTool,
  bootstrapTool,
  projectsTool,
  boardsTool,
  listsTool,
  cardsTool,
  commentsTool,
  tasksTool,
  labelsTool,
  cardMembersTool,
];
