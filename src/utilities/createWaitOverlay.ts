/**
 * Creates a div element that when appended to the document body blocks
 * all user interaction with the app and changes the cursor style to
 * wait.
 */
export function createWaitOverlay() {
  let waitOverlay = document.createElement('div');
  waitOverlay.style.position = 'fixed';
  waitOverlay.style.top = '0px';
  waitOverlay.style.right = '0px';
  waitOverlay.style.bottom = '0px';
  waitOverlay.style.left = '0px';
  waitOverlay.style.cursor = 'wait';
  return waitOverlay;
}
