// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';

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

		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.command === 'ask') {
				const userPrompt = message.text;
				let responseText = '';

				try {
					const streamResponse = await ollama.chat({
						model: 'deepseek-r1:8b',
						messages: [{role: 'user', content: userPrompt}],
						stream: true
					});

					for await (const part of streamResponse) {
						responseText += part.message.content;
						panel.webview.postMessage({command: 'chatResponse', text: responseText});
					}
				} catch (error: unknown) {
					panel.webview.postMessage({command: 'chatResponse', text: `Error: ${String(error)}`});
				}
			}
		});
				

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

			window.addEventListener('message', event => {
				const {command, text} = event.data;
				if (command === 'chatResponse') {
					document.getElementById('response').innerText = text;
				}
			});

		</script>
	</body>
	</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
