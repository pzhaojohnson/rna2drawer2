// tries to detect if the app is running on a Mac computer
// and returns true if so
export function detectMac(): boolean {
  return window.navigator.platform.toLowerCase().includes('mac');
}
