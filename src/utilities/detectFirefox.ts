// tries to detect if the app is running in Firefox
// and returns true if so
export function detectFirefox(): boolean {
  // in case window.navigator.userAgent is not supported
  try {
    return window.navigator.userAgent.toLowerCase().includes('firefox');
  } catch {
    return false;
  }
}
