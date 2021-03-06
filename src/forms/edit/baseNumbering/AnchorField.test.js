import AnchorField from './AnchorField';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import IntegerField from '../../fields/text/IntegerField';

describe('create static method', () => {
  describe('passing the current anchor', () => {
    it('passes anchor with offset', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'asdfasdf');
      let seq = app.strictDrawing.drawing.getSequenceById('asdf');
      seq.numberingOffset = 12;
      seq.numberingAnchor = 31;
      let ele = AnchorField.create(app);
      expect(ele.props.currAnchor).toBe(43);
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = AnchorField.create(app);
      expect(ele.props.currAnchor).toBe(0);
    });
  });

  describe('setAnchor callback', () => {
    it('sets anchor taking into account offset', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('qwer', 'qwerqwer');
      let seq = app.strictDrawing.drawing.getSequenceById('qwer');
      seq.numberingOffset = 24;
      seq.numberingAnchor = 0;
      let ele = AnchorField.create(app);
      let spy = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setAnchor(60);
      expect(seq.numberingAnchor).toBe(36); // takes into account offset
      expect(spy).toHaveBeenCalled(); // refreshes form
      app.undo();
      seq = app.strictDrawing.drawing.getSequenceById('qwer');
      expect(seq.numberingAnchor).toBe(0); // pushed undo
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = AnchorField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setAnchor(5);
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });

    it('does not set when given anchor is the same as current anchor', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'asdfqwer');
      let seq = app.strictDrawing.drawing.getSequenceById('asdf');
      seq.numberingAnchor = 6;
      let ele = AnchorField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setAnchor(6);
      expect(seq.numberingAnchor).toBe(6); // does not change anchor
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });
  });
});

describe('render method', () => {
  it('renders as an integer field', () => {
    let comp = new AnchorField({ currAnchor: 0 });
    let ele = comp.render();
    expect(ele.type).toBe(IntegerField);
  });

  it('passes currAnchor prop', () => {
    let comp = new AnchorField({ currAnchor: 212 });
    let ele = comp.render();
    expect(ele.props.initialValue).toBe(212);
  });

  describe('set callback', () => {
    it('calls setAnchor callback', () => {
      let setAnchor = jest.fn();
      let comp = new AnchorField({ currAnchor: 0, setAnchor: setAnchor });
      let ele = comp.render();
      ele.props.set(102);
      expect(setAnchor).toHaveBeenCalled();
      expect(setAnchor.mock.calls[0][0]).toBe(102);
    });
  });
});
