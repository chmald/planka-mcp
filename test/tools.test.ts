/**
 * Planka MCP Server - Tool Definition Tests
 * 
 * Tests tool definitions, schemas, and configurations
 * Uses compiled dist output to test the actual built modules
 */

import { describe, it, expect, beforeAll } from "node:test";
import assert from "node:assert";

// Import from compiled dist (after build)
import {
  allTools,
  coreTools,
  adminTools,
  optionalTools,
  getEnabledTools,
  toolCounts,
  type GroupedToolDefinition,
} from "../dist/tools/index.js";

describe("Tool Definitions", () => {
  describe("Tool Categories", () => {
    it("should have core tools defined", () => {
      assert.ok(coreTools.length > 0, "Core tools should not be empty");
      console.log(`  ✓ Core tools: ${coreTools.length} tools`);
    });

    it("should have admin tools defined", () => {
      assert.ok(adminTools.length > 0, "Admin tools should not be empty");
      console.log(`  ✓ Admin tools: ${adminTools.length} tools`);
    });

    it("should have optional tools defined", () => {
      assert.ok(optionalTools.length > 0, "Optional tools should not be empty");
      console.log(`  ✓ Optional tools: ${optionalTools.length} tools`);
    });

    it("should have all tools combined correctly", () => {
      const expectedTotal = coreTools.length + adminTools.length + optionalTools.length;
      assert.strictEqual(allTools.length, expectedTotal, "All tools should equal sum of categories");
      console.log(`  ✓ Total tools: ${allTools.length}`);
    });
  });

  describe("Tool Counts", () => {
    it("should have accurate tool counts", () => {
      assert.strictEqual(toolCounts.core, coreTools.length);
      assert.strictEqual(toolCounts.admin, adminTools.length);
      assert.strictEqual(toolCounts.optional, optionalTools.length);
      assert.strictEqual(toolCounts.total, allTools.length);
      console.log(`  ✓ Tool counts match actual definitions`);
    });

    it("should have operation counts", () => {
      assert.ok(toolCounts.coreOperations > 0, "Core operations should exist");
      assert.ok(toolCounts.adminOperations > 0, "Admin operations should exist");
      assert.ok(toolCounts.optionalOperations > 0, "Optional operations should exist");
      assert.ok(toolCounts.totalOperations > 0, "Total operations should exist");
      console.log(`  ✓ Total operations: ${toolCounts.totalOperations}`);
    });
  });

  describe("getEnabledTools", () => {
    it("should return only core tools by default", () => {
      const tools = getEnabledTools({});
      assert.strictEqual(tools.length, coreTools.length);
      console.log(`  ✓ Default config returns ${tools.length} core tools`);
    });

    it("should return all tools when enableAllTools is true", () => {
      const tools = getEnabledTools({ enableAllTools: true });
      assert.strictEqual(tools.length, allTools.length);
      console.log(`  ✓ enableAllTools returns ${tools.length} tools`);
    });

    it("should include admin tools when enabled", () => {
      const tools = getEnabledTools({ enableAdminTools: true });
      assert.strictEqual(tools.length, coreTools.length + adminTools.length);
      console.log(`  ✓ enableAdminTools returns ${tools.length} tools`);
    });

    it("should include optional tools when enabled", () => {
      const tools = getEnabledTools({ enableOptionalTools: true });
      assert.strictEqual(tools.length, coreTools.length + optionalTools.length);
      console.log(`  ✓ enableOptionalTools returns ${tools.length} tools`);
    });

    it("should combine admin and optional tools when both enabled", () => {
      const tools = getEnabledTools({ enableAdminTools: true, enableOptionalTools: true });
      assert.strictEqual(tools.length, coreTools.length + adminTools.length + optionalTools.length);
      console.log(`  ✓ Combined config returns ${tools.length} tools`);
    });
  });

  describe("Tool Structure Validation", () => {
    function validateTool(tool: GroupedToolDefinition) {
      // Validate required properties
      assert.ok(tool.name, `Tool must have a name`);
      assert.ok(tool.description, `Tool ${tool.name} must have a description`);
      assert.ok(tool.operations, `Tool ${tool.name} must have operations`);
      assert.ok(tool.inputSchema, `Tool ${tool.name} must have an inputSchema`);

      // Validate name format (alphanumeric, no spaces, starts with letter)
      assert.match(tool.name, /^[a-zA-Z][a-zA-Z0-9_-]*$/, `Tool name "${tool.name}" must be alphanumeric`);

      // Validate operations
      const operationNames = Object.keys(tool.operations);
      assert.ok(operationNames.length > 0, `Tool ${tool.name} must have at least one operation`);

      for (const [opName, op] of Object.entries(tool.operations)) {
        assert.ok(op.method, `Operation ${tool.name}.${opName} must have a method`);
        assert.ok(["GET", "POST", "PUT", "PATCH", "DELETE"].includes(op.method), 
          `Operation ${tool.name}.${opName} has invalid method: ${op.method}`);
        assert.ok(op.path, `Operation ${tool.name}.${opName} must have a path`);
        assert.ok(op.path.startsWith("/"), `Operation ${tool.name}.${opName} path must start with /`);
      }

      // Validate inputSchema
      assert.strictEqual(tool.inputSchema.type, "object", `Tool ${tool.name} inputSchema must be object type`);
      assert.ok(tool.inputSchema.properties, `Tool ${tool.name} must have properties`);
      assert.ok(tool.inputSchema.properties.action, `Tool ${tool.name} must have action property`);
      assert.ok(Array.isArray(tool.inputSchema.required), `Tool ${tool.name} must have required array`);
      assert.ok(tool.inputSchema.required.includes("action"), `Tool ${tool.name} must require action`);
    }

    it("should validate all core tools", () => {
      for (const tool of coreTools) {
        validateTool(tool);
      }
      console.log(`  ✓ All ${coreTools.length} core tools are valid`);
    });

    it("should validate all admin tools", () => {
      for (const tool of adminTools) {
        validateTool(tool);
      }
      console.log(`  ✓ All ${adminTools.length} admin tools are valid`);
    });

    it("should validate all optional tools", () => {
      for (const tool of optionalTools) {
        validateTool(tool);
      }
      console.log(`  ✓ All ${optionalTools.length} optional tools are valid`);
    });

    it("should have unique tool names", () => {
      const names = allTools.map(t => t.name);
      const uniqueNames = new Set(names);
      assert.strictEqual(names.length, uniqueNames.size, "All tool names must be unique");
      console.log(`  ✓ All ${names.length} tool names are unique`);
    });
  });
});
