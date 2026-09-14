import UIScene from "../ui.scene";

export function showDisconnectWarning(): void {
  const warningDiv = document.getElementById('disconnect-warning');
  if (warningDiv) warningDiv.style.display = 'block';
}

export function hideDisconnectWarning(): void {
  const warningDiv = document.getElementById('disconnect-warning');
  if (warningDiv) warningDiv.style.display = 'none';
}

export function createWarningComponent(context: UIScene): void {
  context.add.dom(700, 400).createFromCache('disconnectWarning');
}
