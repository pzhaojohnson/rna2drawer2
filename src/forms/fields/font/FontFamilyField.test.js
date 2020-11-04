import { FontFamilyField } from './FontFamilyField';

let set = jest.fn();

let f = FontFamilyField({
  name: 'asdf ZXCVZXCV',
  initialValue: 'Courier New',
  set: set,
});

it('passes name', () => {
  expect(f.props.name).toBe('asdf ZXCVZXCV');
});

it('passes initial value', () => {
  expect(f.props.initialValue).toBe('Courier New');
});

it('lists available fonts', () => {
  // wait for available fonts to be queried
  setTimeout(() => {
    expect(f.props.options.length).toBeGreaterThan(2);
    expect(f.props.options.includes('Arial')).toBeTruthy();
    expect(f.props.options.includes('Times New Roman')).toBeTruthy();
  }, 1000);
});

it('passes value between set callbacks', () => {
  f.props.set('New Courier');
  expect(set.mock.calls[0][0]).toBe('New Courier');
});
