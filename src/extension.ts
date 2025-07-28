import * as vscode from 'vscode';
import { PromptsManager, PromptTemplate } from './prompts';

interface PromptQuickPickItem extends vscode.QuickPickItem {
	prompt?: PromptTemplate;
	isAction?: boolean;
	actionId?: string;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const promptsManager = new PromptsManager(context);

	// Command to open the prompts quick pick
	const showPrompts = vscode.commands.registerCommand('copilot-prompts-launcher.showPrompts', async () => {
		const quickPick = vscode.window.createQuickPick<PromptQuickPickItem>();
		quickPick.placeholder = 'Select a prompt to use, or click the trash icon to delete one';
		quickPick.matchOnDescription = true;
		quickPick.matchOnDetail = true;

		const editButton: vscode.QuickInputButton = {
			iconPath: new vscode.ThemeIcon('edit'),
			tooltip: 'Edit Prompt'
		};
		const trashButton: vscode.QuickInputButton = {
			iconPath: new vscode.ThemeIcon('trash'),
			tooltip: 'Delete Prompt'
		};

		const updateItems = () => {
			const prompts = promptsManager.getPrompts();
			quickPick.items = prompts.map((prompt: PromptTemplate) => ({
				label: prompt.name,
				description: prompt.description,
				detail: prompt.prompt.slice(0, 100) + '...',
				prompt: prompt,
				buttons: [editButton, trashButton]
			}));
		};

		updateItems();

		quickPick.onDidTriggerItemButton(async (e) => {
			if (e.item.prompt) {
				const selectedPrompt = e.item.prompt;

				if (e.button.tooltip === 'Delete Prompt') {
					const confirm = await vscode.window.showWarningMessage(
						`Are you sure you want to delete the prompt "${selectedPrompt.name}"?`,
						{ modal: true },
						'Delete'
					);
					if (confirm === 'Delete') {
						promptsManager.deletePrompt(selectedPrompt.id);
						vscode.window.showInformationMessage(`Prompt "${selectedPrompt.name}" deleted.`);
						updateItems(); // Refresh the list
					}
				} else if (e.button.tooltip === 'Edit Prompt') {
					quickPick.hide();

					const newName = await vscode.window.showInputBox({
						prompt: 'Enter the new name for the prompt',
						value: selectedPrompt.name
					});
					if (newName === undefined) { return; } // User cancelled

					const newDescription = await vscode.window.showInputBox({
						prompt: 'Enter the new description',
						value: selectedPrompt.description
					});
					if (newDescription === undefined) { return; }

					const newPromptText = await vscode.window.showInputBox({
						prompt: 'Enter the new prompt text',
						value: selectedPrompt.prompt
					});
					if (newPromptText === undefined) { return; }

					const updatedPrompt: PromptTemplate = {
						...selectedPrompt,
						name: newName,
						description: newDescription,
						prompt: newPromptText
					};

					promptsManager.savePrompt(updatedPrompt);
					vscode.window.showInformationMessage(`Prompt "${newName}" updated successfully.`);
				}
			}
		});

		quickPick.onDidAccept(async () => {
			const selected = quickPick.selectedItems[0];
			if (selected?.prompt) {
				const promptText = selected.prompt.prompt;
				quickPick.hide();

				await vscode.env.clipboard.writeText(promptText);
				try {
					await vscode.commands.executeCommand('workbench.view.chat.focus');
					await new Promise(resolve => setTimeout(resolve, 150));
					await vscode.commands.executeCommand('chat.action.insertIntoInput', { text: promptText });
				} catch (error) {
					console.error('Failed to auto-paste prompt into chat. Falling back to clipboard notification.', error);
					vscode.window.showInformationMessage('Prompt copied. Press Ctrl+V to paste.');
				}
			}
		});

		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
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

	// Create status bar button
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.text = "$(copilot) Prompts";
	statusBarItem.tooltip = "Show Copilot prompts";
	statusBarItem.command = 'copilot-prompts-launcher.showPrompts';
	statusBarItem.show();

	context.subscriptions.push(showPrompts, savePrompt, statusBarItem);
}

// This method is called when your extension is deactivated
export function deactivate() { }
