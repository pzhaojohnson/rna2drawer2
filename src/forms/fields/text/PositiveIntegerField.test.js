import PositiveIntegerField from './PositiveIntegerField';
import IntegerField from './IntegerField';

it('renders as an integer field', () => {
  let comp = new PositiveIntegerField({ name: 'asdf', initialValue: 1 });
  let ele = comp.render();
  expect(ele.type).toBe(IntegerField);
});

it('passes name, initialValue and minLabelWidth props', () => {
  let comp = new PositiveIntegerField({ name: 'mznx', initialValue: 103, minLabelWidth: '182px' });
  let ele = comp.render();
  expect(ele.props.name).toBe('mznx');
  expect(ele.props.initialValue).toBe(103);
  expect(ele.props.minLabelWidth).toBe('182px');
});

it('initialValue is optional', () => {
  let comp = new PositiveIntegerField({ name: 'asdf' });
  let ele = comp.render();
  expect(ele.props.initialValue).toBe(undefined);
});

describe('checkValue callback', () => {
  it('rejects nonpositive numbers', () => {
    let comp = new PositiveIntegerField({ name: 'asdf', initialValue: 1 });
    let ele = comp.render();
    expect(ele.props.checkValue(-105)).toBeTruthy(); // negative
    expect(ele.props.checkValue(-2)).toBeTruthy(); // negative
    expect(ele.props.checkValue(0)).toBeTruthy(); // zero
    // the smallest positive integer
    expect(ele.props.checkValue(1)).toBeFalsy();
    expect(ele.props.checkValue(3)).toBeFalsy(); // positive
    expect(ele.props.checkValue(29)).toBeFalsy(); // positive
  });
});

it('passes onInvalidInput callback', () => {
  let onInvalidInput = jest.fn();
  let comp = new PositiveIntegerField({ onInvalidInput: onInvalidInput });
  expect(onInvalidInput).not.toHaveBeenCalled();
  comp.props.onInvalidInput();
  expect(onInvalidInput).toHaveBeenCalled();
});

it('passes value between set callbacks', () => {
  let set = jest.fn();
  let comp = new PositiveIntegerField({ name: 'asdf', initialValue: 1, set: set });
  let ele = comp.render();
  ele.props.set(829);
  expect(set).toHaveBeenCalled();
  expect(set.mock.calls[0][0]).toBe(829);
});
