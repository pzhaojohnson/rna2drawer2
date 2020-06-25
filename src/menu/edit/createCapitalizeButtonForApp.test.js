import createCapitalizeButtonForApp from './createCapitalizeButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';

it('creates with key and text', () => {
  let app = new App(() => NodeSVG());
  let b = createCapitalizeButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Capitalize');
});

describe('onClick callback', () => {
  it('all base letters are already capitalized', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('qwer', 'QWER');
    drawing.appendSequenceOutOfView('asdf', 'ASDFASDFASDF');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = createCapitalizeButtonForApp(app);
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
    let b = createCapitalizeButtonForApp(app);
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('ZXCCQQWWEBN');
    expect(spy2).toHaveBeenCalled();
  });
});
