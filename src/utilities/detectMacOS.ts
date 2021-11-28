// tries to detect if the app is running on macOS
// and returns true if so
export function detectMacOS(): boolean {
  // in case window.navigator.platform is not supported
  try {
    return window.navigator.platform.toLowerCase().includes('mac');
  } catch {
    return false;
  }
}
