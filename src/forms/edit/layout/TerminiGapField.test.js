import TerminiGapField from './TerminiGapField';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';

describe('create static method', () => {
  it('passes the current termini gap', () => {
    let app = new App(() => NodeSVG());
    let generalProps = app.strictDrawing.generalLayoutProps();
    generalProps.terminiGap = 18.92873;
    app.strictDrawing.setGeneralLayoutProps(generalProps);
    let ele = TerminiGapField.create(app);
    expect(ele.props.currTerminiGap).toBe(18.92873);
  });

  describe('setTerminiGap callback', () => {
    it('can set termini gap', () => {
      let app = new App(() => NodeSVG());
      let ele = TerminiGapField.create(app);
      let prev = app.strictDrawing.generalLayoutProps().terminiGap;
      let spy1 = jest.spyOn(app.strictDrawing, 'applyLayout');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setTerminiGap(94.821);
      // sets termini gap
      expect(app.strictDrawing.generalLayoutProps().terminiGap).toBe(94.821);
      expect(spy1).toHaveBeenCalled(); // updates layout
      expect(spy2).toHaveBeenCalled(); // refreshes field
      app.undo();
      expect(app.strictDrawing.generalLayoutProps().terminiGap).toBe(prev); // pushed undo
    });

    it('does not set when given is same as current', () => {
      let app = new App(() => NodeSVG());
      let generalProps = app.strictDrawing.generalLayoutProps();
      generalProps.terminiGap = 16.2;
      app.strictDrawing.setGeneralLayoutProps(generalProps);
      let ele = TerminiGapField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setTerminiGap(16.2);
      // termini gap was not changed
      expect(app.strictDrawing.generalLayoutProps().terminiGap).toBe(16.2);
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh field
    });
  });
});

describe('render method', () => {
  it('renders as a nonnegative number field', () => {
    let comp = new TerminiGapField({ currTerminiGap: 0 });
    let ele = comp.render();
    expect(ele.type).toBe(NonnegativeNumberField);
  });

  it('passes name, currTerminiGap and minLabelWidth props', () => {
    let comp = new TerminiGapField({ currTerminiGap: 12.6, minLabelWidth: '48.2px' });
    let ele = comp.render();
    expect(ele.props.name).toBe('Termini Gap');
    expect(ele.props.initialValue).toBe(12.6);
    expect(ele.props.minLabelWidth).toBe('48.2px');
  });

  it('set callback calls setTerminiGap callback', () => {
    let setTerminiGap = jest.fn();
    let comp = new TerminiGapField({ currTerminiGap: 0, setTerminiGap: setTerminiGap });
    let ele = comp.render();
    ele.props.set(56.8);
    expect(setTerminiGap).toHaveBeenCalled();
    expect(setTerminiGap.mock.calls[0][0]).toBe(56.8);
  });
});
