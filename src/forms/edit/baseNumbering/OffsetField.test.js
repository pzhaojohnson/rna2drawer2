import OffsetField from './OffsetField';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import IntegerField from '../../fields/text/IntegerField';

describe('create static method', () => {
  describe('passing the current offset', () => {
    it('passes the offset of the first sequence', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'asdfasdf');
      let seq = app.strictDrawing.drawing.getSequenceById('asdf');
      seq.numberingOffset = 38;
      let ele = OffsetField.create(app);
      expect(ele.props.currOffset).toBe(38);
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = OffsetField.create(app);
      expect(ele.props.currOffset).toBe(0);
    });
  });

  describe('setOffset callback', () => {
    it('sets the offset of the first sequence', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('qwer', 'qwerasdf');
      let seq = app.strictDrawing.drawing.getSequenceById('qwer');
      seq.numberingOffset = 2;
      let ele = OffsetField.create(app);
      let spy = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setOffset(98);
      expect(seq.numberingOffset).toBe(98); // sets offset
      expect(spy).toHaveBeenCalled(); // refreshes form
      app.undo();
      seq = app.strictDrawing.drawing.getSequenceById('qwer');
      expect(seq.numberingOffset).toBe(2); // pushed undo
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = OffsetField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setOffset(12);
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });

    it('does not set when the given offset is the same as the current offset', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('qwer', 'qwerqwer');
      let seq = app.strictDrawing.drawing.getSequenceById('qwer');
      seq.numberingOffset = 9;
      let ele = OffsetField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.setOffset(9);
      expect(seq.numberingOffset).toBe(9); // does not change offset
      expect(spy1).not.toHaveBeenCalled(); // does not push undo
      expect(spy2).not.toHaveBeenCalled(); // does not refresh form
    });
  });
});

describe('render method', () => {
  it('renders as an integer field', () => {
    let comp = new OffsetField({ currOffset: 0 });
    let ele = comp.render();
    expect(ele.type).toBe(IntegerField);
  });

  it('passes currOffset prop', () => {
    let comp = new OffsetField({ currOffset: 208 });
    let ele = comp.render();
    expect(ele.props.initialValue).toBe(208);
  });

  describe('set callback', () => {
    it('calls setOffset callback', () => {
      let setOffset = jest.fn();
      let comp = new OffsetField({ currOffset: 0, setOffset: setOffset });
      let ele = comp.render();
      ele.props.set(33);
      expect(setOffset).toHaveBeenCalled();
      expect(setOffset.mock.calls[0][0]).toBe(33);
    });
  });
});
