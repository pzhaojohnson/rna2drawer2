import StrokeField from './StrokeField';
import ColorField from '../../fields/ColorField';

describe('create static method', () => {
  let app = {
    strictDrawingInteraction: {
      tertiaryBondsInteraction: {},
    },
  };

  describe('no tertiary bond selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
    let ele = StrokeField.create(app);

    it('passes a default value for current stroke', () => {
      expect(ele.props.currStroke).toBe('#000000');
    });

    it('setStroke callback does not throw', () => {
      expect(() => ele.props.setStroke('#123456')).not.toThrow();
    });
  });

  describe('a tertiary bond is selected', () => {
    let selected = {};
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
    
    it('passes current stroke', () => {
      selected.stroke = '#ab1155';
      let ele = StrokeField.create(app);
      expect(ele.props.currStroke).toBe('#ab1155');
    });

    describe('setStroke callback', () => {
      it('has fill', () => {
        selected.stroke = '#123456';
        selected.fill = '#123456';
        let ele = StrokeField.create(app);
        ele.props.setStroke('#aa32ff');
        expect(selected.stroke).toBe('#aa32ff');
        expect(selected.fill).toBe('#aa32ff');
      });

      it('fill is falsy', () => {
        selected.stroke = '#abcdef';
        selected.fill = undefined;
        let ele = StrokeField.create(app);
        ele.props.setStroke('#aaccbb');
        expect(selected.stroke).toBe('#aaccbb');
        expect(selected.fill).toBeFalsy();
      });

      it('fill is none', () => {
        selected.stroke = '#aabbcc';
        selected.fill = 'none';
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
