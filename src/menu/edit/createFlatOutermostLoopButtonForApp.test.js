import createFlatOutermostLoopButtonForApp from './createFlatOutermostLoopButtonForApp';

let app = {
  strictDrawing: {
    hasFlatOutermostLoop: () => false,
    flatOutermostLoop: () => {},
  },
  pushUndo: () => {},
  drawingChangedNotByInteraction: () => {},
};

it('passes a key and text', () => {
  let b = createFlatOutermostLoopButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Flat Outermost Loop');
});

describe('onClick callback', () => {
  it('when drawing has flat outermost loop', () => {
    app.strictDrawing.hasFlatOutermostLoop = () => true;
    app.pushUndo = jest.fn();
    app.strictDrawing.flatOutermostLoop = jest.fn();
    app.drawingChangedNotByInteraction = jest.fn();
    let b = createFlatOutermostLoopButtonForApp(app);
    b.props.onClick();
    expect(app.pushUndo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.flatOutermostLoop.mock.calls.length).toBe(0);
    expect(app.drawingChangedNotByInteraction.mock.calls.length).toBe(0);
  });

  it('when drawing does not have flat outermost loop', () => {
    app.strictDrawing.hasFlatOutermostLoop = () => false;
    let calls = 0;
    let pushUndoCall = 0;
    let flatOutermostLoopCall = 0;
    let drawingChangedNotByInteractionCall = 0;
    app.pushUndo = () => { pushUndoCall = ++calls; };
    app.strictDrawing.flatOutermostLoop = () => { flatOutermostLoopCall = ++calls; };
    app.drawingChangedNotByInteraction = () => { drawingChangedNotByInteractionCall = ++calls; };
    let b = createFlatOutermostLoopButtonForApp(app);
    b.props.onClick();
    expect(pushUndoCall).toBe(1);
    expect(flatOutermostLoopCall).toBe(2);
    expect(drawingChangedNotByInteractionCall).toBe(3);
  });
});

describe('disabled and checked props', () => {
  it('when drawing has flat outermost loop', () => {
    app.strictDrawing.hasFlatOutermostLoop = () => true;
    let b = createFlatOutermostLoopButtonForApp(app);
    expect(b.props.disabled).toBeTruthy();
    expect(b.props.checked).toBeTruthy();
  });

  it('when drawing does not have flat outermost loop', () => {
    app.strictDrawing.hasFlatOutermostLoop = () => false;
    let b = createFlatOutermostLoopButtonForApp(app);
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});
