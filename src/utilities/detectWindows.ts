// tries to detect if the app is running on a Windows PC
// and returns true if so
export function detectWindows(): boolean {
  return window.navigator.platform.toLowerCase().includes('win');
}
