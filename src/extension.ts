// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	const disposable = vscode.commands.registerCommand('DeepSeek.start', () => {
		
		const panel = vscode.window.createWebviewPanel(
			'deepseek',
			'Deep Seek Chat',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);

		panel.webview.html = getWebviewStructure();

	});

	context.subscriptions.push(disposable);
}

function getWebviewStructure() : string {
	return /*html*/`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<style>
			body {
				font-family: Arial, sans-serif;
				padding: 20px;
			}
			#response { border: 1px solid #ccc; padding: 10px; margin-top: 10px; }
		</style>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Deep Seek Chat</title>
	</head>
	<body>
		<h1>Deep Seek Chat</h1>
		<textarea id="chat" style="width: 100%; height: 300px;" placeholder="Ask something..."></textarea><br/>
		<button id="ask">Ask</button>
		<div id="response"></div>

		<script>
			const vscode = acquireVsCodeApi();

			document.getElementById('ask').addEventListener('click', () => {
				const text = document.getElementById('chat').value;
				vscode.postMessage({command: 'ask', text: text});	
			});


		</script>
	</body>
	</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
