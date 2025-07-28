import * as vscode from 'vscode';
import { PromptsManager, PromptTemplate } from './prompts';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const promptsManager = new PromptsManager(context);

	// Command to open the prompts quick pick
	const showPrompts = vscode.commands.registerCommand('copilot-prompts-launcher.showPrompts', async () => {
		const prompts = promptsManager.getPrompts();
		const selected = await vscode.window.showQuickPick(
			prompts.map(prompt => ({
				label: prompt.name,
				description: prompt.description,
				detail: prompt.prompt.slice(0, 100) + '...',
				prompt: prompt
			})),
			{
				placeHolder: 'Select a prompt to use...',
				matchOnDescription: true,
				matchOnDetail: true
			}
		);

		if (selected) {
			const promptText = selected.prompt.prompt;

			// First, place the text onto the clipboard. This is our reliable source for the paste action
			// and serves as the fallback if automatic pasting fails.
			await vscode.env.clipboard.writeText(promptText);

			try {
				// Attempt to automatically focus the chat and paste the content.
				await vscode.commands.executeCommand('workbench.view.chat.focus');

				// Wait a moment for the UI to catch up and focus the input.
				await new Promise(resolve => setTimeout(resolve, 150));

				// Execute the generic paste command, which should target the now-focused chat input.
				await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
			} catch (error) {
				// If any step fails, notify the user that the prompt is on the clipboard for manual pasting.
				console.error('Failed to auto-paste prompt into chat. Falling back to clipboard notification.', error);
				vscode.window.showInformationMessage('Prompt copied. Press Ctrl+V to paste.');
			}
		}
	});

	// Command to save a new prompt
	const savePrompt = vscode.commands.registerCommand('copilot-prompts-launcher.savePrompt', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		const selection = editor.selection;
		const text = editor.document.getText(selection);
		if (!text) {
			vscode.window.showErrorMessage('No text selected');
			return;
		}

		const name = await vscode.window.showInputBox({
			prompt: 'Enter a name for the prompt'
		});

		if (!name) {
			return;
		}

		const description = await vscode.window.showInputBox({
			prompt: 'Enter a description for the prompt'
		});

		if (!description) {
			return;
		}

		const prompt: PromptTemplate = {
			id: Date.now().toString(),
			name,
			description,
			prompt: text
		};

		promptsManager.savePrompt(prompt);
		vscode.window.showInformationMessage(`Prompt "${name}" saved successfully`);
	});

	// Command to delete a prompt
	const deletePrompt = vscode.commands.registerCommand('copilot-prompts-launcher.deletePrompt', async () => {
		const prompts = promptsManager.getPrompts();
		const selected = await vscode.window.showQuickPick(
			prompts.map(prompt => ({
				label: prompt.name,
				description: prompt.description,
				prompt: prompt
			})),
			{
				placeHolder: 'Select a prompt to delete...',
			}
		);

		if (selected) {
			promptsManager.deletePrompt(selected.prompt.id);
			vscode.window.showInformationMessage(`Prompt "${selected.prompt.name}" deleted`);
		}
	});

	// Create status bar button
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.text = "$(copilot) Prompts";
	statusBarItem.tooltip = "Show Copilot prompts";
	statusBarItem.command = 'copilot-prompts-launcher.showPrompts';
	statusBarItem.show();

	context.subscriptions.push(showPrompts, savePrompt, deletePrompt, statusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() { }
