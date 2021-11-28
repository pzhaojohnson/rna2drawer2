// tries to detect if the app is running on a Windows PC
// and returns true if so
export function detectWindows(): boolean {
  // in case window.navigator.platform is not supported
  try {
    return window.navigator.platform.toLowerCase().includes('win');
  } catch {
    return false;
  }
}
