import IntegerField from './IntegerField';
import NumberField from './NumberField';

it('renders as a number field', () => {
  let comp = new IntegerField({ name: 'asdf', initialValue: 0 });
  let ele = comp.render();
  expect(ele.type).toBe(NumberField);
});

it('passes name, initialValue and minLabelWidth props', () => {
  let comp = new IntegerField({ name: 'qqwwee', initialValue: 92, minLabelWidth: '119px' });
  let ele = comp.render();
  expect(ele.props.name).toBe('qqwwee');
  expect(ele.props.initialValue).toBe(92);
  expect(ele.props.minLabelWidth).toBe('119px');
});

it('initialValue is optional', () => {
  let comp = new IntegerField({ name: 'asdf' });
  let ele = comp.render();
  expect(ele.props.initialValue).toBe(undefined);
});

describe('checkValue callback', () => {
  it('rejects non-integers', () => {
    let comp = new IntegerField({ name: 'asdf', initialValue: 0 });
    let ele = comp.render();
    expect(ele.props.checkValue(1.2)).toBeTruthy();
    expect(ele.props.checkValue(-12.01)).toBeTruthy();
  });

  it('accepts integers with no custom checkValue callback', () => {
    let comp = new IntegerField({ name: 'asdf', initialValue: 0 });
    let ele = comp.render();
    expect(ele.props.checkValue(19)).toBeFalsy();
    expect(ele.props.checkValue(-3)).toBeFalsy();
  });

  it('accepts and rejects according to custom checkValue callback', () => {
    let comp = new IntegerField({
      name: 'asdf',
      initialValue: 0,
      checkValue: n => n == 5 ? 'Rejected' : '',
    });
    let ele = comp.render();
    expect(ele.props.checkValue(5)).toBeTruthy();
    expect(ele.props.checkValue(6)).toBeFalsy();
  });
});

it('passes on input callbacks', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  let comp = new IntegerField({
    onInput: onInput,
    onValidInput: onValidInput,
    onInvalidInput: onInvalidInput,
  });
  expect(comp.props.onInput).toBe(onInput);
  expect(comp.props.onValidInput).toBe(onValidInput);
  expect(comp.props.onInvalidInput).toBe(onInvalidInput);
});

it('passes value between set callbacks', () => {
  let set = jest.fn();
  let comp = new IntegerField({ name: 'asdf', initialValue: 0, set: set });
  let ele = comp.render();
  ele.props.set(1298);
  expect(set).toHaveBeenCalled();
  expect(set.mock.calls[0][0]).toBe(1298);
});
