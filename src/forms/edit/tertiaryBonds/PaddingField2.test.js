import PaddingField2 from './PaddingField2';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';

let app = {
  strictDrawingInteraction: {
    tertiaryBondsInteraction: {},
  },
  pushUndo: () => {},
  drawingChangedNotByInteraction: () => {},
};

it('does not accept negative values', () => {
  let f = PaddingField2(app);
  expect(f.type).toBe(NonnegativeNumberField);
});

describe('initial value', () => {
  it('when no tertiary bond selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
    let f = PaddingField2(app);
    expect(f.props.initialValue).toBe(undefined);
  });

  it('when a tertiary bond is selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding2: 9.26 };
    let f = PaddingField2(app);
    expect(f.props.initialValue).toBe(9.26);
  });
});

describe('set callback', () => {
  it('no tertiary bond is selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
    let f = PaddingField2(app);
    expect(() => f.props.set(6)).not.toThrow();
  });

  it('passed value is the same as the current value', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding2: 1.2 };
    let f = PaddingField2(app);
    let spy = jest.spyOn(app, 'pushUndo');
    f.props.set(1.2);
    expect(spy).not.toHaveBeenCalled();
  });

  it('passed value is different than the current value', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding2: 4.1 };
    let f = PaddingField2(app);
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    f.props.set(6.6);
    // updates padding 2
    expect(app.strictDrawingInteraction.tertiaryBondsInteraction.selected.padding2).toBe(6.6);
    expect(spy1).toHaveBeenCalled(); // pushes undo
    expect(spy2).toHaveBeenCalled(); // refreshes app
  });
});

it('trims value', () => {
  app.strictDrawingInteraction.tertiaryBondsInteraction.selected = { padding2: 6.352 };
  let f = PaddingField2(app);
  expect(f.props.initialValue).toBe(6.35); // trims initial value
  let spy = jest.spyOn(app, 'pushUndo');
  spy.mockClear();
  f.props.set(6.348);
  // does not set since trimmed values are the same
  expect(app.strictDrawingInteraction.tertiaryBondsInteraction.selected.padding2).toBe(6.352);
  expect(spy).not.toHaveBeenCalled();
});
