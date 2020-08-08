import StrokeField from './StrokeField';
import ColorField from '../../fields/color/ColorField';

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
      expect(ele.props.currStroke).toBeFalsy();
    });

    it('when a tertiary bond is selected', () => {
      let selected = { stroke: '#ab1155', strokeOpacity: 0.61 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      expect(ele.props.currStroke).toStrictEqual({ color: '#ab1155', opacity: 0.61 });
    });
  });

  describe('setStroke callback', () => {
    it('no tertiary bond is selected', () => {
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStroke({ color: '#123456', opacity: 0.5 });
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh app
    });

    it('no change in stroke or opacity', () => {
      let selected = { stroke: '#aa32bb', strokeOpacity: 0.82 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStroke({ color: '#aa32bb', opacity: 0.82 });
      expect(selected.stroke).toBe('#aa32bb'); // does not change
      expect(selected.strokeOpacity).toBe(0.82); // does not change
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh app
    });

    it('stroke changes but opacity stays the same', () => {
      let selected = { stroke: '#abcdef', strokeOpacity: 0.56 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStroke({ color: '#aabbcc', opacity: 0.56 });
      expect(selected.stroke).toBe('#aabbcc');
      expect(selected.strokeOpacity).toBe(0.56);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it('stroke stays the same but opacity changes', () => {
      let selected = { stroke: '#112233', strokeOpacity: 0.1 };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = StrokeField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setStroke({ color: '#112233', opacity: 0.2 });
      expect(selected.stroke).toBe('#112233');
      expect(selected.strokeOpacity).toBe(0.2);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    describe('setting fill alongside stroke', () => {
      it('has fill', () => {
        let selected = { stroke: '#123456', strokeOpacity: 0.88, fill: '#224466' };
        app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
        let ele = StrokeField.create(app);
        ele.props.setStroke({ color: '#aa32ff', opacity: 0.77 });
        expect(selected.stroke).toBe('#aa32ff');
        expect(selected.strokeOpacity).toBe(0.77);
        expect(selected.fill).toBe('#aa32ff');
      });

      it('fill is falsy', () => {
        let selected = { stroke: '#abcdef', strokeOpacity: 0.75, fill: undefined };
        app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
        let ele = StrokeField.create(app);
        ele.props.setStroke({ color: '#aaccbb', opacity: 0.75 });
        expect(selected.stroke).toBe('#aaccbb');
        expect(selected.strokeOpacity).toBe(0.75);
        expect(selected.fill).toBeFalsy();
      });

      it('fill is none', () => {
        let selected = { stroke: '#aabbcc', strokeOpacity: 0.2, fill: 'none' };
        app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
        let ele = StrokeField.create(app);
        ele.props.setStroke({ color: '#aafd21', opacity: 0.25 });
        expect(selected.stroke).toBe('#aafd21');
        expect(selected.strokeOpacity).toBe(0.25);
        expect(selected.fill).toBe('none');
      });
    });
  });
});

describe('render method', () => {
  let setStroke = jest.fn();
  let comp = new StrokeField({
    currStroke: { color: '#aa22ee', opacity: 0.24 },
    setStroke: setStroke,
  });
  let ele = comp.render();

  it('returns a color field', () => {
    expect(ele.type).toBe(ColorField);
  });

  it('passes a name', () => {
    expect(ele.props.name).toBeTruthy();
  });
  
  it('passes current stroke', () => {
    expect(ele.props.initialValue).toStrictEqual({ color: '#aa22ee', opacity: 0.24 });
  });

  it('passes set callback', () => {
    ele.props.set({ color: '#16af22', opacity: 0.45 });
    expect(setStroke).toHaveBeenCalled();
    expect(setStroke.mock.calls[0][0]).toStrictEqual({ color: '#16af22', opacity: 0.45 });
  });
});
