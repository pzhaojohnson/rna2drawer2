import { FontSizeField } from './FontSizeField';

let set = jest.fn();

let f = FontSizeField({
  name: 'AAQQWWDD',
  initialValue: 6.56,
  set: set,
});

it('passes name', () => {
  expect(f.props.name).toBe('AAQQWWDD');
});

it('passes initial value', () => {
  expect(f.props.initialValue).toBe(6.56);
});

it('does not allow font sizes less than 1', () => {
  expect(f.props.checkValue(0)).toBeTruthy();
  expect(f.props.checkValue(0.99)).toBeTruthy();
  expect(f.props.checkValue(1)).toBeFalsy();
  expect(f.props.checkValue(6)).toBeFalsy();
});

it('passes value between set callbacks', () => {
  f.props.set(3.91);
  expect(set.mock.calls[0][0]).toBe(3.91);
});
