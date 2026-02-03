/**
 * Planka MCP Server - Server Module Tests
 * 
 * Tests server imports and basic functionality without requiring Planka connection
 * Uses compiled dist output to test the actual built modules
 */

import { describe, it } from "node:test";
import assert from "node:assert";

describe("Server Module", () => {
  describe("Tool Imports", () => {
    it("should import tools index module", async () => {
      const tools = await import("../dist/tools/index.js");
      assert.ok(tools.allTools, "Should export allTools");
      assert.ok(tools.getEnabledTools, "Should export getEnabledTools");
      assert.ok(tools.toolCounts, "Should export toolCounts");
      console.log(`  ✓ Tools module imports successfully`);
    });

    it("should import types module", async () => {
      const types = await import("../dist/tools/types.js");
      assert.ok(types.buildGroupedSchema, "Should export buildGroupedSchema");
      console.log(`  ✓ Types module imports successfully`);
    });

    it("should import core tools", async () => {
      const core = await import("../dist/tools/core/index.js");
      assert.ok(core.coreTools, "Should export coreTools");
      assert.ok(Array.isArray(core.coreTools), "coreTools should be an array");
      console.log(`  ✓ Core tools module imports (${core.coreTools.length} tools)`);
    });

    it("should import admin tools", async () => {
      const admin = await import("../dist/tools/admin/index.js");
      assert.ok(admin.adminTools, "Should export adminTools");
      assert.ok(Array.isArray(admin.adminTools), "adminTools should be an array");
      console.log(`  ✓ Admin tools module imports (${admin.adminTools.length} tools)`);
    });

    it("should import optional tools", async () => {
      const optional = await import("../dist/tools/optional/index.js");
      assert.ok(optional.optionalTools, "Should export optionalTools");
      assert.ok(Array.isArray(optional.optionalTools), "optionalTools should be an array");
      console.log(`  ✓ Optional tools module imports (${optional.optionalTools.length} tools)`);
    });
  });

  describe("MCP SDK Integration", () => {
    it("should import MCP SDK server module", async () => {
      const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
      assert.ok(McpServer, "Should import McpServer");
      console.log(`  ✓ MCP SDK server module imports`);
    });

    it("should import MCP SDK stdio transport", async () => {
      const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
      assert.ok(StdioServerTransport, "Should import StdioServerTransport");
      console.log(`  ✓ MCP SDK stdio transport imports`);
    });

    it("should import MCP SDK SSE transport", async () => {
      const { SSEServerTransport } = await import("@modelcontextprotocol/sdk/server/sse.js");
      assert.ok(SSEServerTransport, "Should import SSEServerTransport");
      console.log(`  ✓ MCP SDK SSE transport imports`);
    });

    it("should import MCP SDK types", async () => {
      const types = await import("@modelcontextprotocol/sdk/types.js");
      assert.ok(types.CallToolRequestSchema, "Should import CallToolRequestSchema");
      assert.ok(types.ListToolsRequestSchema, "Should import ListToolsRequestSchema");
      console.log(`  ✓ MCP SDK types import`);
    });
  });

  describe("Dependencies", () => {
    it("should import undici", async () => {
      const { request } = await import("undici");
      assert.ok(typeof request === "function", "Should import request function");
      console.log(`  ✓ undici imports successfully`);
    });
  });
});
