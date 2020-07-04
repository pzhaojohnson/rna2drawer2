import NumberField from './NumberField';

it('passes name, initialValue and minLabelWidth props', () => {
  let comp = new NumberField({
    name: 'asdf zxcv',
    initialValue: 123.5,
    minLabelWidth: '78px',
  });
  let ele = comp.render();
  expect(ele.props.name).toBe('asdf zxcv');
  expect(ele.props.initialValue).toBe('123.5');
  expect(ele.props.minLabelWidth).toBe('78px');
});

describe('checkValue callback', () => {
  it('rejects non-numbers', () => {
    let comp = new NumberField({ name: 'name', initialValue: 0 });
    let ele = comp.render();
    expect(ele.props.checkValue('')).toBeTruthy(); // empty
    expect(ele.props.checkValue('qwer')).toBeTruthy(); // not a number
  });

  it('rejects nonfinite numbers', () => {
    let comp = new NumberField({ name: 'name', initialValue: 0 });
    let ele = comp.render();
    let nf = 'NaN';
    expect(typeof Number.parseFloat(nf)).toBe('number'); // does parse as a number
    expect(ele.props.checkValue(nf)).toBeTruthy(); // but is nonfinite
  });

  it('accepts numbers when no custom checkValue callback given', () => {
    let comp = new NumberField({ name: 'name', initialValue: 0 });
    let ele = comp.render();
    expect(ele.props.checkValue('1.1')).toBeFalsy(); // a positive number
    expect(ele.props.checkValue('-10.9')).toBeFalsy(); // a negative number
  });

  it('rejects numbers rejected by custom checkValue callback', () => {
    let comp = new NumberField({
      name: 'name',
      initialValue: 0,
      checkValue: v => v == '2' ? 'Rejected' : '',
    });
    let ele = comp.render();
    expect(ele.props.checkValue('2')).toBeTruthy();
  });

  it('accepts numbers accepted by custom checkValue callback', () => {
    let comp = new NumberField({
      name: 'name',
      initialValue: 0,
      checkValue: v => v == '2' ? '' : 'Rejected',
    });
    let ele = comp.render();
    expect(ele.props.checkValue('2')).toBeFalsy();
  });
});

it('passes value between set callbacks', () => {
  let set = jest.fn();
  let comp = new NumberField({ initialValue: 0, set: set });
  let ele = comp.render();
  ele.props.set('801.2');
  expect(set).toHaveBeenCalled();
  expect(set.mock.calls[0][0]).toBe(801.2); // converted string to number
});
