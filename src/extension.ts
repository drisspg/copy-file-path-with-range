import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	const copyRelativePath = vscode.commands.registerCommand('copy-file-path-with-range.copyRelativePath', () => {
		copyPathWithRange(false);
	});

	const copyAbsolutePath = vscode.commands.registerCommand('copy-file-path-with-range.copyAbsolutePath', () => {
		copyPathWithRange(true);
	});

	context.subscriptions.push(copyRelativePath, copyAbsolutePath);
}

function copyPathWithRange(useAbsolutePath: boolean) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor');
		return;
	}

	const document = editor.document;
	const selections = editor.selections;
	
	let filePath: string;
	if (useAbsolutePath) {
		filePath = document.fileName;
	} else {
		filePath = getRelativePath(document.fileName);
	}

	if (selections.length === 1) {
		const range = formatRange(selections[0], document);
		const pathWithRange = `${filePath}${range}`;
		copyToClipboard(pathWithRange);
	} else {
		const ranges = selections.map(sel => formatRange(sel, document)).join(',');
		const pathWithRanges = `${filePath}${ranges}`;
		copyToClipboard(pathWithRanges);
	}
}

function formatRange(selection: vscode.Selection, document: vscode.TextDocument): string {
	const start = selection.start;
	const end = selection.end;
	
	const isFullLine = isFullLineSelection(selection, document);
	
	if (start.line === end.line) {
		if (isFullLine) {
			return `:${start.line + 1}`;
		} else {
			return `:${start.line + 1}:${start.character + 1}-${end.character + 1}`;
		}
	} else {
		if (isFullLine) {
			return `:${start.line + 1}-${end.line + 1}`;
		} else {
			return `:${start.line + 1}:${start.character + 1}-${end.line + 1}:${end.character + 1}`;
		}
	}
}

function isFullLineSelection(selection: vscode.Selection, document: vscode.TextDocument): boolean {
	const start = selection.start;
	const end = selection.end;
	
	if (start.character !== 0) {
		return false;
	}
	
	const endLine = document.lineAt(end.line);
	if (end.character !== endLine.text.length && !(end.line > start.line && end.character === 0)) {
		return false;
	}
	
	return true;
}

function getRelativePath(absolutePath: string): string {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return absolutePath;
	}
	
	for (const folder of workspaceFolders) {
		const folderPath = folder.uri.fsPath;
		if (absolutePath.startsWith(folderPath)) {
			return path.relative(folderPath, absolutePath);
		}
	}
	
	return absolutePath;
}

function copyToClipboard(text: string) {
	vscode.env.clipboard.writeText(text).then(() => {
		vscode.window.setStatusBarMessage('Copied path with range', 2000);
	}, (error) => {
		vscode.window.showErrorMessage(`Failed to copy: ${error}`);
	});
}

export function deactivate() {}