import { StartPositionField } from './StartPositionField';

it('passes props to underlying integer field', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  let set = jest.fn();
  let f = StartPositionField({
    initialValue: 192,
    onInput: onInput,
    onValidInput: onValidInput,
    onInvalidInput: onInvalidInput,
    set: set,
  });
  expect(f.props.initialValue).toBe(192);
  expect(f.props.onInput).toBe(onInput);
  expect(f.props.onValidInput).toBe(onValidInput);
  expect(f.props.onInvalidInput).toBe(onInvalidInput);
  expect(f.props.set).toBe(set);
});
