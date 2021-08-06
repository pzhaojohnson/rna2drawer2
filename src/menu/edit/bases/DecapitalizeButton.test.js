import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { DecapitalizeButton } from './DecapitalizeButton';

describe('onClick callback', () => {
  it('drawing has no capital base letters', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequence('qwer', 'qwerqwer');
    drawing.appendSequence('zxcv', 'zxc');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = DecapitalizeButton({ app: app });
    b.props.onClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qwerqwerzxc');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('drawing has capital base letters', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequence('qwer', 'qQweRR');
    drawing.appendSequence('asdf', 'aASDff');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = DecapitalizeButton({ app: app });
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qqwerraasdff');
    expect(spy2).toHaveBeenCalled();
  });
});
