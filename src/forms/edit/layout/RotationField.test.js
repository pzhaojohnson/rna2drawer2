import RotationField from './RotationField';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import NumberField from '../../fields/text/NumberField';

describe('create static method', () => {
  it('passes the current rotation', () => {
    let app = new App(() => NodeSVG());
    let generalProps = app.strictDrawing.generalLayoutProps();
    generalProps.rotation = (Math.PI / 3) + (6 * Math.PI) + 1e-8;
    app.strictDrawing.setGeneralLayoutProps(generalProps);
    let ele = RotationField.create(app);
    // was normalized, converted to degrees and had excess decimal places removed
    expect(ele.props.currRotation).toBe(60);
  });

  describe('setRotation callback', () => {
    it('can set the rotation', () => {
      let app = new App(() => NodeSVG());
      let ele = RotationField.create(app);
      let spy = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setRotation(-30);
      // normalizes and converts to radians
      expect(app.strictDrawing.generalLayoutProps().rotation).toBeCloseTo(11 * Math.PI / 6);
      expect(spy).toHaveBeenCalled(); // refreshes form
      app.undo();
      expect(app.strictDrawing.generalLayoutProps().rotation).toBeCloseTo(0); // pushed undo
    });

    it('does not set if given rotation is close to current rotation', () => {
      let app = new App(() => NodeSVG());
      let generalProps = app.strictDrawing.generalLayoutProps();
      generalProps.rotation = 8 * Math.PI / 3;
      app.strictDrawing.setGeneralLayoutProps(generalProps);
      let ele = RotationField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      // requires normalization of the angle
      ele.props.setRotation(-240);
      // does not change rotation
      expect(app.strictDrawing.generalLayoutProps().rotation).toBeCloseTo(8 * Math.PI / 3);
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });
  });
});

describe('render method', () => {
  it('rendered as a number field', () => {
    let comp = new RotationField({ currRotation: 0 });
    let ele = comp.render();
    expect(ele.type).toBe(NumberField);
  });

  it('passes name, currRotation and minLabelWidth props', () => {
    let comp = new RotationField({ currRotation: 38, minLabelWidth: '112px' });
    let ele = comp.render();
    expect(ele.props.name).toBe('Rotation');
    expect(ele.props.initialValue).toBe(38);
    expect(ele.props.minLabelWidth).toBe('112px');
  });
  
  it('set callback calls setRotation callback', () => {
    let setRotation = jest.fn();
    let comp = new RotationField({ currRotation: 0, setRotation: setRotation });
    let ele = comp.render();
    ele.props.set(1002);
    expect(setRotation).toHaveBeenCalled();
    expect(setRotation.mock.calls[0][0]).toBe(1002);
  });
});
