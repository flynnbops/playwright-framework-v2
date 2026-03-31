# MCP Server Setup for Playwright Project

This project will use the official [TypeScript SDK for Model Context Protocol](https://github.com/modelcontextprotocol/typescript-sdk) to add MCP server support.

## Steps to Add MCP Server

1. **Install the TypeScript SDK:**
   ```sh
   npm install @modelcontextprotocol/typescript-sdk
   ```
2. **Create a basic MCP server entry point (e.g., `mcp-server.ts`):**
   See the SDK documentation for a minimal server example.
3. **Add a launch script to `package.json`:**
   ```json
   "scripts": {
     "mcp-server": "ts-node mcp-server.ts"
   }
   ```
4. **Configure VS Code for MCP server debugging:**
   - Add `.vscode/mcp.json` as described below.
5. **Reference SDK documentation:**
   - [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
   - [MCP Protocol Docs](https://modelcontextprotocol.io/)

---

## Example `mcp.json` for VS Code

```
{
  "servers": {
    "playwright-mcp-server": {
      "type": "stdio",
      "command": "npm",
      "args": ["run", "mcp-server"]
    }
  }
}
```

---

For more, see the [official documentation](https://modelcontextprotocol.io/).
