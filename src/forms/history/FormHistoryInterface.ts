// an interface for navigating among previous and more recent forms
// (comparable to the window.history interface object)
export type FormHistoryInterface = {

  // should close the current form and open the form
  // that came immediately prior if there is one present
  // (otherwise should do nothing)
  goBackward: () => void;

  // should indicate if there are any previous forms
  // to go backward to
  canGoBackward: () => boolean;

  // should close the current form and open the next
  // most recent form if there is one present
  // (otherwise should do nothing)
  goForward: () => void;

  // should indicate if there are any more recent forms
  // to go forward to
  canGoForward: () => boolean;
}
