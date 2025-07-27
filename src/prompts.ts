import * as vscode from 'vscode';

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    prompt: string;
}

export class PromptsManager {
    private static readonly STORAGE_KEY = 'copilot-prompts';
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public savePrompt(prompt: PromptTemplate): void {
        const prompts = this.getPrompts();
        const existingIndex = prompts.findIndex(p => p.id === prompt.id);

        if (existingIndex >= 0) {
            prompts[existingIndex] = prompt;
        } else {
            prompts.push(prompt);
        }

        this.context.globalState.update(PromptsManager.STORAGE_KEY, prompts);
    }

    public getPrompts(): PromptTemplate[] {
        return this.context.globalState.get<PromptTemplate[]>(PromptsManager.STORAGE_KEY, []);
    }

    public deletePrompt(id: string): void {
        const prompts = this.getPrompts();
        const filtered = prompts.filter(p => p.id !== id);
        this.context.globalState.update(PromptsManager.STORAGE_KEY, filtered);
    }

    public getPrompt(id: string): PromptTemplate | undefined {
        return this.getPrompts().find(p => p.id === id);
    }
}
