/**
 * Optional tools - Extended functionality (not essential for basic operations)
 */
import { GroupedToolDefinition } from "../types.js";
import {
  actionsTool,
  attachmentsTool,
  boardMembersTool,
  customFieldsTool,
  notificationsTool,
  backgroundImagesTool,
  cardExtrasTool,
  commentExtrasTool,
  listExtrasTool,
  taskExtrasTool,
  labelExtrasTool,
  cardMemberExtrasTool,
  userInfoTool,
} from "./tools.js";

export {
  actionsTool,
  attachmentsTool,
  boardMembersTool,
  customFieldsTool,
  notificationsTool,
  backgroundImagesTool,
  cardExtrasTool,
  commentExtrasTool,
  listExtrasTool,
  taskExtrasTool,
  labelExtrasTool,
  cardMemberExtrasTool,
  userInfoTool,
};

/**
 * All optional tools combined
 */
export const optionalTools: GroupedToolDefinition[] = [
  actionsTool,
  attachmentsTool,
  boardMembersTool,
  customFieldsTool,
  notificationsTool,
  backgroundImagesTool,
  cardExtrasTool,
  commentExtrasTool,
  listExtrasTool,
  taskExtrasTool,
  labelExtrasTool,
  cardMemberExtrasTool,
  userInfoTool,
];
