/**
 * Admin tools - Require admin privileges
 */
import { GroupedToolDefinition } from "../types.js";
import {
  configTool,
  usersTool,
  webhooksTool,
  projectManagersTool,
} from "./tools.js";

export {
  configTool,
  usersTool,
  webhooksTool,
  projectManagersTool,
};

/**
 * All admin tools combined
 */
export const adminTools: GroupedToolDefinition[] = [
  configTool,
  usersTool,
  webhooksTool,
  projectManagersTool,
];
