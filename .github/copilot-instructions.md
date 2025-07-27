# Copilot Prompts Launcher Extension Development Guide

This is a VS Code extension that helps users manage and quickly access custom Copilot prompts.

## Project Structure

- `src/extension.ts` - Main extension code
- `src/prompts.ts` - Prompt management functionality
- `src/templates/` - Default prompt templates

## Key Components

### PromptsManager (src/prompts.ts)
- Handles storage and retrieval of prompts using VS Code's extension storage API
- Provides CRUD operations for prompts

### Extension Commands (src/extension.ts)
- `showPrompts` - Displays quick pick menu with saved prompts
- `savePrompt` - Saves selected text as a new prompt
- `deletePrompt` - Removes a saved prompt

## Development Workflow

1. **Building**:
   ```bash
   npm run compile
   ```

2. **Testing**:
   ```bash
   npm run test
   ```

3. **Debugging**:
   - Launch "Run Extension" configuration in VS Code
   - Test commands via Command Palette (Ctrl/Cmd + Shift + P)

## Extension Points

- Status Bar Button
- Context Menu Items
- Command Palette Commands

## Storage

Prompts are stored in extension's global state using VS Code's ExtensionContext.
Structure:
```typescript
interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    prompt: string;
}
```

## Common Tasks

1. Adding new commands:
   - Add command to `package.json` contributes section
   - Register command in `extension.ts`
   - Update README.md with new command

2. Modifying prompt storage:
   - Edit `PromptsManager` class in `prompts.ts`
   - Consider data migration for existing users
