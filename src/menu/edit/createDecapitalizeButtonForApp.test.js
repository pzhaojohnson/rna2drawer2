import createDecapitalizeButtonForApp from './createDecapitalizeButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';

it('creates with key and text', () => {
  let app = new App(() => NodeSVG());
  let b = createDecapitalizeButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Decapitalize');
});

describe('onClick callback', () => {
  it('drawing has no capital base letters', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
    drawing.appendSequenceOutOfView('zxcv', 'zxc');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = createDecapitalizeButtonForApp(app);
    b.props.onClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qwerqwerzxc');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('drawing has capital base letters', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('qwer', 'qQweRR');
    drawing.appendSequenceOutOfView('asdf', 'aASDff');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = createDecapitalizeButtonForApp(app);
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qqwerraasdff');
    expect(spy2).toHaveBeenCalled();
  });
});
