# Copilot Prompts Launcher

Visual Studio Code extension that adds quick access to your custom GitHub Copilot prompts.

## Features

- Store and manage your frequently used Copilot prompts
- Quick access via status bar button
- Context menu integration
- Save selected text as a new prompt
- Global storage of prompts across workspaces

## Usage

1. **Access Prompts**:
   - Click the Copilot Prompts button in the status bar
   - Use the command palette and type "Show Copilot Prompts"

2. **Save a New Prompt**:
   - Select text in the editor
   - Right-click and choose "Save Selected Text as Copilot Prompt"
   - Enter a name and description for the prompt

3. **Delete a Prompt**:
   - Use the command palette and type "Delete Copilot Prompt"
   - Select the prompt you want to delete

## Commands

- `Copilot Prompts: Show Prompts` - Display the list of saved prompts
- `Copilot Prompts: Save Selected Text as Prompt` - Save selected text as a new prompt
- `Copilot Prompts: Delete Prompt` - Delete an existing prompt

## Requirements

- Visual Studio Code 1.85.0 or higher
- GitHub Copilot extension installed

## Extension Settings

Currently, this extension has no configurable settings.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Release Notes

### 0.0.1

Initial release:
- Basic prompt management
- Status bar integration
- Context menu integration
