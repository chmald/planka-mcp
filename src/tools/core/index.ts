/**
 * Core tools - Essential for basic Kanban operations (always enabled)
 */
import { GroupedToolDefinition } from "../types.js";
import {
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
