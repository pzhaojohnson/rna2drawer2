let overlay = null as HTMLDivElement | null;

export function makeUserWait() {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed;'
      + ' top: 0px;'
      + ' right: 0px;'
      + ' bottom: 0px;'
      + ' left: 0px;'
      + ' z-index: 2;'
      + ' cursor: wait;';
    document.body.appendChild(overlay);
  }
}

export function stopMakingUserWait() {
  if (overlay) {
    document.body.removeChild(overlay);
    overlay = null;
  }
}

export function makeUserWaitFor(f: () => void) {
  makeUserWait();
  try {
    f();
  } catch (err) {}
  stopMakingUserWait();
}
