import StrokeWidthField from './StrokeWidthField';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';

function mockApp() {
  return {
    strictDrawingInteraction: {
      tertiaryBondsInteraction: {},
    },
    pushUndo: () => {},
    drawingChangedNotByInteraction: () => {},
  };
}

describe('create static method', () => {
  describe('passing the current stroke width', () => {
    it('when no tertiary bond is selected', () => {
      let app = mockApp();
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = StrokeWidthField.create(app);
      expect(ele.props.currStrokeWidth).toBe(0);
    });

    it('when a tertiary bond is selected', () => {
      let app = mockApp();
      let selected = { strokeWidth: 5.9902 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeWidthField.create(app);
      expect(ele.props.currStrokeWidth).toBe(5.9902);
    });
  });

  describe('setStrokeWidth callback', () => {
    it('does not throw when no tertiary bond is selected', () => {
      let app = mockApp();
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = StrokeWidthField.create(app);
      expect(() => ele.props.setStrokeWidth(1.2)).not.toThrow();
    });

    it('can set the stroke width of the selected tertiary bond', () => {
      let app = mockApp();
      let selected = { strokeWidth: 5.8 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeWidthField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStrokeWidth(10.2);
      expect(selected.strokeWidth).toBe(10.2); // sets stroke width
      expect(spy1).toHaveBeenCalled(); // pushes undo
      expect(spy2).toHaveBeenCalled(); // refreshes app
    });

    it('does set when given value is same as current value', () => {
      let app = mockApp();
      let selected = { strokeWidth: 3.91 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeWidthField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStrokeWidth(3.91);
      expect(selected.strokeWidth).toBe(3.91); // does not change
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh app
    });
  });
});

describe('render method', () => {
  let setStrokeWidth = jest.fn();
  let comp = new StrokeWidthField({ currStrokeWidth: 5.889, setStrokeWidth: setStrokeWidth });
  let ele = comp.render();

  it('returns a nonnegative number field', () => {
    expect(ele.type).toBe(NonnegativeNumberField);
  });

  it('passes a name', () => {
    expect(ele.props.name).toBeTruthy();
  });

  it('passes the current stroke width', () => {
    expect(ele.props.initialValue).toBe(5.889);
  });

  it('passes callback to set stroke width', () => {
    ele.props.set(10.221);
    expect(setStrokeWidth).toHaveBeenCalled();
    expect(setStrokeWidth.mock.calls[0][0]).toBe(10.221);
  });
});
