/**
 * Planka MCP Server - Grouped Tool Definitions
 * 
 * This module exports all tool definitions organized by category:
 * - Core: Essential Kanban operations (always enabled) - 9 tools
 * - Admin: Administrative functions requiring admin privileges - 4 tools
 * - Optional: Extended functionality for advanced use cases - 14 tools
 * 
 * Total: 27 grouped tools covering 104 API operations
 */

export { GroupedToolDefinition, ToolOperation, ToolCategory, buildGroupedSchema } from "./types.js";
export { coreTools } from "./core/index.js";
export { adminTools } from "./admin/index.js";
export { optionalTools } from "./optional/index.js";

import { GroupedToolDefinition } from "./types.js";
import { coreTools } from "./core/index.js";
import { adminTools } from "./admin/index.js";
import { optionalTools } from "./optional/index.js";

/**
 * All tools combined (for reference/documentation)
 */
export const allTools: GroupedToolDefinition[] = [
  ...coreTools,
  ...adminTools,
  ...optionalTools,
];

/**
 * Configuration for tool categories
 */
export interface ToolConfig {
  enableAllTools?: boolean;
  enableAdminTools?: boolean;
  enableOptionalTools?: boolean;
}

/**
 * Gets enabled tools based on configuration
 */
export function getEnabledTools(config: ToolConfig): GroupedToolDefinition[] {
  const { enableAllTools, enableAdminTools, enableOptionalTools } = config;

  if (enableAllTools) {
    return allTools;
  }

  const tools: GroupedToolDefinition[] = [...coreTools];

  if (enableAdminTools) {
    tools.push(...adminTools);
  }

  if (enableOptionalTools) {
    tools.push(...optionalTools);
  }

  return tools;
}

/**
 * Count operations in a tool
 */
function countOperations(tools: GroupedToolDefinition[]): number {
  return tools.reduce((sum, tool) => sum + Object.keys(tool.operations).length, 0);
}

/**
 * Tool counts by category
 */
export const toolCounts = {
  core: coreTools.length,
  coreOperations: countOperations(coreTools),
  admin: adminTools.length,
  adminOperations: countOperations(adminTools),
  optional: optionalTools.length,
  optionalOperations: countOperations(optionalTools),
  total: allTools.length,
  totalOperations: countOperations(allTools),
};
