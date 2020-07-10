import StrokeField from './StrokeField';
import ColorField from '../../fields/ColorField';

function mockApp() {
  return {
    strictDrawingInteraction: {
      tertiaryBondsInteraction: {},
    },
    pushUndo: () => {},
    drawingChangedNotByInteraction: () => {},
  };
}

let app = null;

beforeEach(() => {
  app = mockApp();
});

afterEach(() => {
  app = null;
});

describe('create static method', () => {
  describe('passing the current stroke', () => {
    it('when no tertiary bond is selected', () => {
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = StrokeField.create(app);
      expect(ele.props.currStroke).toBe('#000000'); // passes a default value
    });

    it('when a tertiary bond is selected', () => {
      let selected = { stroke: '#ab1155' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      expect(ele.props.currStroke).toBe('#ab1155');
    });
  });

  describe('setStroke callback', () => {
    it('has no effect when no tertiary bond is selected', () => {
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      expect(() => ele.props.setStroke('#123456')).not.toThrow();
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh app
    });

    it('pushes undo and refreshes app when setting stroke', () => {
      let selected = { stroke: '#abcdef' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStroke('#aa32ff');
      expect(selected.stroke).toBe('#aa32ff'); // sets stroke
      expect(spy1).toHaveBeenCalled(); // pushes undo
      expect(spy2).toHaveBeenCalled(); // refreshes app
    });

    it('has no effect if given stroke is same as current stroke', () => {
      let selected = { stroke: '#aa32bb' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStroke('#aa32bb');
      expect(selected.stroke).toBe('#aa32bb'); // does not change
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh app
    });

    describe('setting fill alongside stroke', () => {
      it('has fill', () => {
        let selected = { stroke: '#123456', fill: '#123456' };
        app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
        let ele = StrokeField.create(app);
        ele.props.setStroke('#aa32ff');
        expect(selected.stroke).toBe('#aa32ff');
        expect(selected.fill).toBe('#aa32ff');
      });

      it('fill is falsy', () => {
        let selected = { stroke: '#abcdef', fill: undefined };
        app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
        let ele = StrokeField.create(app);
        ele.props.setStroke('#aaccbb');
        expect(selected.stroke).toBe('#aaccbb');
        expect(selected.fill).toBeFalsy();
      });

      it('fill is none', () => {
        let selected = { stroke: '#aabbcc', fill: 'none' };
        app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
        let ele = StrokeField.create(app);
        ele.props.setStroke('#aafd21');
        expect(selected.stroke).toBe('#aafd21');
        expect(selected.fill).toBe('none');
      });
    });
  });
});

describe('render method', () => {
  let setStroke = jest.fn();
  let comp = new StrokeField({ currStroke: '#aa22ee', setStroke: setStroke });
  let ele = comp.render();

  it('returns a color field', () => {
    expect(ele.type).toBe(ColorField);
  });

  it('passes a name', () => {
    expect(ele.props.name).toBeTruthy();
  });
  
  it('passes current stroke', () => {
    expect(ele.props.initialValue).toBe('#aa22ee');
  });

  it('passes set callback', () => {
    ele.props.set('#16af22');
    expect(setStroke).toHaveBeenCalled();
    expect(setStroke.mock.calls[0][0]).toBe('#16af22');
  });
});
