import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { CapitalizeButton } from './CapitalizeButton';

describe('onClick callback', () => {
  it('all base letters are already capitalized', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('qwer', 'QWER');
    drawing.appendSequenceOutOfView('asdf', 'ASDFASDFASDF');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = CapitalizeButton({ app: app });
    b.props.onClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('QWERASDFASDFASDF');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('drawing has lowercase base letters', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('zxcv', 'ZxcC');
    drawing.appendSequenceOutOfView('qwer', 'qqWWebN');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = CapitalizeButton({ app: app });
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('ZXCCQQWWEBN');
    expect(spy2).toHaveBeenCalled();
  });
});
