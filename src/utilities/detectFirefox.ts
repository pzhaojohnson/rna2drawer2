// tries to detect if the app is running in Firefox
// and returns true if so
export function detectFirefox(): boolean {
  return window.navigator.userAgent.toLowerCase().includes('firefox');
}
