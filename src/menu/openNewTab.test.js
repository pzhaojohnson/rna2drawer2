import openNewTab from './openNewTab';

it('calls window.open with current URL', () => {
  window.open = jest.fn();
  openNewTab();
  expect(window.open.mock.calls[0][0]).toBe(document.URL);
});
