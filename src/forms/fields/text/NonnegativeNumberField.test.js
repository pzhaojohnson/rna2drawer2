import NonnegativeNumberField from './NonnegativeNumberField';
import NumberField from './NumberField';

it('renders as a number field', () => {
  let comp = new NonnegativeNumberField({ initialValue: 0 });
  let ele = comp.render();
  expect(ele.type).toBe(NumberField);
});

it('passes name, initialValue and minLabelWidth props', () => {
  let comp = new NonnegativeNumberField({
    name: 'QWERasdf',
    initialValue: 62.8,
    minLabelWidth: '112px',
  });
  let ele = comp.render();
  expect(ele.props.name).toBe('QWERasdf');
  expect(ele.props.initialValue).toBe(62.8);
  expect(ele.props.minLabelWidth).toBe('112px');
});

it('initialValue is optional', () => {
  let comp = new NonnegativeNumberField({ name: 'asdf' });
  let ele = comp.render();
  expect(ele.props.initialValue).toBe(undefined);
});

describe('checkValue callback', () => {
  it('rejects negative numbers', () => {
    let comp = new NonnegativeNumberField({ name: 'name', initialValue: 0 });
    let ele = comp.render();
    expect(ele.props.checkValue(-5)).toBeTruthy(); // negative
    expect(ele.props.checkValue(-0.2)).toBeTruthy() // negative
    expect(ele.props.checkValue(0)).toBeFalsy(); // zero
    expect(ele.props.checkValue(0.8)).toBeFalsy(); // positive
    expect(ele.props.checkValue(20.3)).toBeFalsy(); // positive
  });
});

it('passes value between set callbacks', () => {
  let set = jest.fn();
  let comp = new NonnegativeNumberField({ initialValue: 0, set: set });
  let ele = comp.render();
  ele.props.set(1033.6);
  expect(set).toHaveBeenCalled();
  expect(set.mock.calls[0][0]).toBe(1033.6);
});
