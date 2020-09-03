import { CharacterField } from './CharacterField';

let initialValue = 'E';
let onInput = jest.fn();
let onValidInput = jest.fn();
let onInvalidInput = jest.fn();
let set = jest.fn();
let f = CharacterField({
  initialValue: initialValue,
  onInput: onInput,
  onValidInput: onValidInput,
  onInvalidInput: onInvalidInput,
  set: set,
});

it('passes initialValue prop', () => {
  expect(f.props.initialValue).toBe(initialValue);
});

it('does not allow multiple characters', () => {
  expect(f.props.checkValue('ab')).toBeTruthy();
});

it('trims leading and trailing whitespace when checking value', () => {
  expect(f.props.checkValue(' \t\t q \t\t   \t')).toBeFalsy();
});

it('passes on input callbacks', () => {
  expect(f.props.onInput).toBe(onInput);
  expect(f.props.onValidInput).toBe(onValidInput);
  expect(f.props.onInvalidInput).toBe(onInvalidInput);
});

it('trims leading and trailing whitespace when setting', () => {
  f.props.set('\t\t r \t');
  expect(set.mock.calls[0][0]).toBe('r');
});
