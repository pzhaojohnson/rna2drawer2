import SequenceIdField from './SequenceIdField';
import App from '../../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

describe('create static method', () => {
  describe('passing the current sequence ID', () => {
    it('passes the ID of the first sequence', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('qwerasdf', 'qwerqwerasdfasdf');
      let ele = SequenceIdField.create(app);
      expect(ele.props.currSequenceId).toBe('qwerasdf');
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      let ele = SequenceIdField.create(app);
      expect(ele.props.currSequenceId).toBe('');
    });
  });

  describe('setSequenceId callback', () => {
    describe('setting the sequence ID', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'asdfasdf');
      let ele = SequenceIdField.create(app);

      it('sets the sequence ID', () => {
        app.strictDrawing.drawing.getSequenceAtIndex(0).id = 'asdf';
        ele.props.setSequenceId('qwer');
        expect(app.strictDrawing.drawing.getSequenceAtIndex(0).id).toBe('qwer');
      });

      it('pushes undo', () => {
        app.strictDrawing.drawing.getSequenceAtIndex(0).id = 'asdf';
        let spy = jest.spyOn(app, 'pushUndo');
        ele.props.setSequenceId('vcxz');
        expect(spy).toHaveBeenCalled();
      });

      it('updates document title and refreshes field', () => {
        app.strictDrawing.drawing.getSequenceAtIndex(0).id = 'asdf';
        let spy = jest.spyOn(app, 'refresh');
        ele.props.setSequenceId('poiu');
        expect(document.title).toBe('poiu');
        expect(spy).toHaveBeenCalled();
      });
    });

    it('handles a drawing with no sequences', () => {
      let app = new App(() => NodeSVG());
      let ele = SequenceIdField.create(app);
      expect(app.strictDrawing.drawing.numSequences).toBe(0);
      expect(() => ele.props.setSequenceId('asdf')).not.toThrow();
    });

    it('does not set if the given ID is the same as the current ID', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.appendSequence('asdf', 'qwer');
      let ele = SequenceIdField.create(app);
      let spy1 = jest.spyOn(app, 'pushUndo');
      let spy2 = jest.spyOn(app, 'refresh');
      ele.props.setSequenceId('asdf');
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });
});

it('passes current sequence ID to text field', () => {
  let comp = new SequenceIdField({ currSequenceId: 'asdfqwer' });
  let ele = comp.render();
  expect(ele.props.initialValue).toBe('asdfqwer');
});

describe('passed checkValue callback', () => {
  let comp = new SequenceIdField({});
  let ele = comp.render();

  it('gives error message on empty string', () => {
    expect(ele.props.checkValue('')).toBeTruthy();
  });

  it('gives error message on all whitespace', () => {
    expect(ele.props.checkValue('   ')).toBeTruthy();
  });

  it('no error message on a nonempty string', () => {
    expect(ele.props.checkValue('  asdf  ')).toBeFalsy();
  });
});

describe('set callback', () => {
  it('calls setSequenceId callback', () => {
    let setSequenceId = jest.fn();
    let comp = new SequenceIdField({ setSequenceId: setSequenceId });
    let ele = comp.render();
    ele.props.set('asdfqwer');
    expect(setSequenceId).toHaveBeenCalled();
    expect(setSequenceId.mock.calls[0][0]).toBe('asdfqwer');
  });

  it('trims leading and trailing whitespace from ID', () => {
    let setSequenceId = jest.fn();
    let comp = new SequenceIdField({ setSequenceId: setSequenceId });
    let ele = comp.render();
    ele.props.set('  qwe  ty   ');
    expect(setSequenceId.mock.calls[0][0]).toBe('qwe  ty');
  });
});
