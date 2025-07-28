# Copilot & Gemini Prompts Launcher

A simple VS Code extension to easily save, manage, and use custom prompts for AI assistants like GitHub Copilot and Google Gemini. Stop re-typing the same complex instructions and access your favorite prompts with a single hotkey.

Current Version: 0.1.0

## Features

- **Save Prompts from Selection**: Highlight any text in your editor, right-click, and save it as a reusable prompt.
- **Quick Access**: Bring up your list of prompts instantly using a status bar button or a configurable hotkey (`Ctrl+Alt+P` / `Cmd+Alt+P`).
- **Seamless Integration**: Automatically pastes the selected prompt into the active AI chat window (works with Gemini, Copilot Chat, and others).
- **Clipboard Fallback**: If automatic pasting isn't possible, the prompt is copied to your clipboard for a quick `Ctrl+V`.
- **Full Prompt Management**: Easily edit or delete prompts directly from the quick pick menu.

## How to Use

### Saving a New Prompt

1.  Select any block of text in the editor that you want to save as a prompt.
2.  Right-click on the selection.
3.  Choose **"Prompts: Save Selection as Prompt"** from the context menu.
4.  Enter a short, descriptive name for your prompt.
5.  (Optional) Enter a longer description.

 <!-- It's recommended to add a GIF here -->

### Using a Saved Prompt

1.  Press `Ctrl+Alt+P` (or `Cmd+Alt+P` on macOS).
    - _Alternatively_, click the **"$(copilot) Prompts"** button in the status bar.
2.  A list of your saved prompts will appear.
3.  Select the prompt you want to use.
4.  The prompt text will be automatically inserted into your active AI chat window.

 <!-- It's recommended to add a GIF here -->

### Editing or Deleting a Prompt

1.  Open the prompt list (`Ctrl+Alt+P`).
2.  Hover over the prompt you want to manage.
3.  Click the **pencil icon** (`$(edit)`) to edit or the **trash icon** (`$(trash)`) to delete.

## Installation

1.  Run the `vsce package` command in the project root to create a `.vsix` file.
2.  In VS Code, open the Command Palette (`Ctrl+Shift+P`) and select **"Extensions: Install from VSIX..."**.
3.  Choose the generated `.vsix` file.
