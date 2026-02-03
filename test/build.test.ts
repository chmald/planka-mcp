/**
 * Planka MCP Server - Build Verification Tests
 * 
 * Tests that the project builds correctly and produces valid output
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { existsSync, statSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

describe("Build Verification", () => {
  describe("Build Output", () => {
    it("should have dist directory", () => {
      const distPath = resolve(projectRoot, "dist");
      assert.ok(existsSync(distPath), "dist directory should exist after build");
      console.log(`  ✓ dist directory exists`);
    });

    it("should have main entry point (server.js)", () => {
      const serverPath = resolve(projectRoot, "dist", "server.js");
      assert.ok(existsSync(serverPath), "dist/server.js should exist");
      const stat = statSync(serverPath);
      assert.ok(stat.size > 0, "dist/server.js should not be empty");
      console.log(`  ✓ dist/server.js exists (${(stat.size / 1024).toFixed(1)} KB)`);
    });

    it("should have tools module", () => {
      const toolsPath = resolve(projectRoot, "dist", "tools", "index.js");
      assert.ok(existsSync(toolsPath), "dist/tools/index.js should exist");
      console.log(`  ✓ dist/tools/index.js exists`);
    });

    it("should have all tool category modules", () => {
      const categories = ["core", "admin", "optional"];
      for (const category of categories) {
        const indexPath = resolve(projectRoot, "dist", "tools", category, "index.js");
        const toolsPath = resolve(projectRoot, "dist", "tools", category, "tools.js");
        assert.ok(existsSync(indexPath), `dist/tools/${category}/index.js should exist`);
        assert.ok(existsSync(toolsPath), `dist/tools/${category}/tools.js should exist`);
      }
      console.log(`  ✓ All tool category modules exist`);
    });
  });

  describe("Package Configuration", () => {
    it("should have valid package.json", () => {
      const pkgPath = resolve(projectRoot, "package.json");
      assert.ok(existsSync(pkgPath), "package.json should exist");
      
      const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8"));
      
      assert.ok(pkgJson.name, "package.json should have name");
      assert.ok(pkgJson.version, "package.json should have version");
      assert.ok(pkgJson.main, "package.json should have main entry");
      assert.ok(pkgJson.bin, "package.json should have bin entry");
      console.log(`  ✓ package.json is valid (${pkgJson.name}@${pkgJson.version})`);
    });

    it("should have correct main entry point", () => {
      const pkgJson = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf-8"));
      assert.strictEqual(pkgJson.main, "dist/server.js");
      console.log(`  ✓ Main entry point: ${pkgJson.main}`);
    });

    it("should have bin entry for CLI", () => {
      const pkgJson = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf-8"));
      assert.ok(pkgJson.bin["planka-mcp"], "bin should have planka-mcp command");
      console.log(`  ✓ CLI binary: planka-mcp`);
    });

    it("should have files array for npm publish", () => {
      const pkgJson = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf-8"));
      assert.ok(Array.isArray(pkgJson.files), "files should be an array");
      assert.ok(pkgJson.files.includes("dist"), "files should include dist");
      console.log(`  ✓ Files for npm: ${pkgJson.files.join(", ")}`);
    });
  });

  describe("TypeScript Configuration", () => {
    it("should have tsconfig.json", () => {
      const tsconfigPath = resolve(projectRoot, "tsconfig.json");
      assert.ok(existsSync(tsconfigPath), "tsconfig.json should exist");
      console.log(`  ✓ tsconfig.json exists`);
    });
  });
});
