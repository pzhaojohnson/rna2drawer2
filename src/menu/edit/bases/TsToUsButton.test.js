import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { TsToUsButton } from './TsToUsButton';

describe('onClick callback', () => {
  it('drawing has lowercase and uppercase Us but no Ts', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('asdf', 'asdfuudf');
    drawing.appendSequenceOutOfView('qwer', 'qwUer');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = TsToUsButton({ app: app });
    b.props.onClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('asdfuudfqwUer');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('drawing has lowercase and uppercase Ts', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('qwer', 'qwtasdf');
    drawing.appendSequenceOutOfView('asdf', 'asdTnMTas');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = TsToUsButton({ app: app });
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qwuasdfasdUnMUas');
    expect(spy2).toHaveBeenCalled();
  });
});
