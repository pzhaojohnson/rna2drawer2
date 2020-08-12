import PaddingField1 from './PaddingField1';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';

let app = {
  strictDrawingInteraction: {
    tertiaryBondsInteraction: {},
  },
  pushUndo: () => {},
  drawingChangedNotByInteraction: () => {},
};

it('does not accept negative values', () => {
  let f = PaddingField1(app);
  expect(f.type).toBe(NonnegativeNumberField);
});

describe('initial value', () => {
  it('when no tertiary bond selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
    let f = PaddingField1(app);
    expect(f.props.initialValue).toBe(undefined);
  });

  it('when a tertiary bond is selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding1: 7.08 };
    let f = PaddingField1(app);
    expect(f.props.initialValue).toBe(7.08);
  });
});

describe('set callback', () => {
  it('no tertiary bond is selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
    let f = PaddingField1(app);
    expect(() => f.props.set(5)).not.toThrow();
  });

  it('passed value is the same as the current value', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding1: 12.2 };
    let f = PaddingField1(app);
    let spy = jest.spyOn(app, 'pushUndo');
    f.props.set(12.2);
    expect(spy).not.toHaveBeenCalled();
  });

  it('passed value is different than the current value', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding1: 2.2 };
    let f = PaddingField1(app);
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    f.props.set(5.6);
    // updates padding 1
    expect(app.strictDrawingInteraction.tertiaryBondsInteraction.selected.padding1).toBe(5.6);
    expect(spy1).toHaveBeenCalled(); // pushes undo
    expect(spy2).toHaveBeenCalled(); // refreshes app
  });
});

it('trims value', () => {
  app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding1: 5.108 };
  let f = PaddingField1(app);
  expect(f.props.initialValue).toBe(5.11); // trims initial value
  let spy = jest.spyOn(app, 'pushUndo');
  spy.mockClear();
  f.props.set(5.112);
  // does not set since trimmed values are the same
  expect(app.strictDrawingInteraction.tertiaryBondsInteraction.selected.padding1).toBe(5.108);
  expect(spy).not.toHaveBeenCalled();
});
