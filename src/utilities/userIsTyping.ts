// returns true if the active element is a text input or textarea
export function userIsTyping(): boolean {
  if (!document.activeElement) {
    return false;
  }

  let tagName = document.activeElement.tagName;
  tagName = tagName.toLowerCase();
  return tagName == 'input' || tagName == 'textarea';
}
