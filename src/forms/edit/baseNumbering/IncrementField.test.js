import IncrementField from './IncrementField';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import PositiveIntegerField from '../../fields/text/PositiveIntegerField';

describe('create static method', () => {
  describe('passing the current increment', () => {
    it('passes the increment of the first sequence', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'asdfqwer');
      let seq = app.strictDrawing.drawing.getSequenceById('asdf');
      seq.numberingIncrement = 52;
      let ele = IncrementField.create(app);
      expect(ele.props.currIncrement).toBe(52);
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = IncrementField.create(app);
      expect(ele.props.currIncrement).toBeGreaterThan(0);
    });
  });

  describe('setIncrement callback', () => {
    it('sets the increment of the first sequence', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('qwer', 'qwerqwer');
      let seq = app.strictDrawing.drawing.getSequenceById('qwer');
      seq.numberingIncrement = 12;
      let ele = IncrementField.create(app);
      let spy = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setIncrement(112);
      expect(seq.numberingIncrement).toBe(112); // set increment
      expect(spy).toHaveBeenCalled(); // refreshed form
      app.undo();
      seq = app.strictDrawing.drawing.getSequenceById('qwer');
      expect(seq.numberingIncrement).toBe(12); // pushed undo
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = IncrementField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setIncrement(100);
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });

    it('does not set if the given increment is the same as the current increment', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'asdfasdf');
      let seq = app.strictDrawing.drawing.getSequenceById('asdf');
      seq.numberingIncrement = 25;
      let ele = IncrementField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setIncrement(25);
      expect(seq.numberingIncrement).toBe(25); // does not change increment
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });
  });
});

describe('render method', () => {
  it('renders as a positive integer field', () => {
    let comp = new IncrementField({ currIncrement: 1 });
    let ele = comp.render();
    expect(ele.type).toBe(PositiveIntegerField);
  });

  it('passes currIncrement and minLabelWidth props', () => {
    let comp = new IncrementField({ currIncrement: 23, minLabelWidth: '206px' });
    let ele = comp.render();
    expect(ele.props.initialValue).toBe(23);
    expect(ele.props.minLabelWidth).toBe('206px');
  });

  describe('set callback', () => {
    it('calls setIncrement callback', () => {
      let setIncrement = jest.fn();
      let comp = new IncrementField({ currIncrement: 20, setIncrement: setIncrement });
      let ele = comp.render();
      ele.props.set(12);
      expect(setIncrement).toHaveBeenCalled();
      expect(setIncrement.mock.calls[0][0]).toBe(12);
    });
  });
});
