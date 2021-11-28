// tries to detect if the app is running on macOS
// and returns true if so
export function detectMacOS(): boolean {
  return window.navigator.platform.toLowerCase().includes('mac');
}
