import createTsToUsButtonForApp from './createTsToUsButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';

it('creates with key and text', () => {
  let app = new App(() => NodeSVG());
  let b = createTsToUsButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Ts to Us');
});

describe('onClick callback', () => {
  it('drawing has lowercase and uppercase Us but no Ts', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('asdf', 'asdfuudf');
    drawing.appendSequenceOutOfView('qwer', 'qwUer');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = createTsToUsButtonForApp(app);
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
    let b = createTsToUsButtonForApp(app);
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qwuasdfasdUnMUas');
    expect(spy2).toHaveBeenCalled();
  });
});
