import createRoundOutermostLoopButtonForApp from './createRoundOutermostLoopButtonForApp';

let app = {
  strictDrawing: {
    hasRoundOutermostLoop: () => true,
    roundOutermostLoop: () => {},
  },
  pushUndo: () => {},
  drawingChangedNotByInteraction: () => {},
};

it('passes a key', () => {
  let b = createRoundOutermostLoopButtonForApp(app);
  expect(b.key).toBeTruthy();
});

it('passes text', () => {
  let b = createRoundOutermostLoopButtonForApp(app);
  expect(b.props.text).toBe('Round Outermost Loop');
});

describe('onClick callback', () => {
  it('when drawing has round outermost loop', () => {
    app.strictDrawing.hasRoundOutermostLoop = () => true;
    app.pushUndo = jest.fn();
    app.strictDrawing.roundOutermostLoop = jest.fn();
    app.drawingChangedNotByInteraction = jest.fn();
    let b = createRoundOutermostLoopButtonForApp(app);
    b.props.onClick();
    expect(app.pushUndo.mock.calls.length).toBe(0);
    expect(app.strictDrawing.roundOutermostLoop.mock.calls.length).toBe(0);
    expect(app.drawingChangedNotByInteraction.mock.calls.length).toBe(0);
  });

  it('when drawing does not have round outermost loop', () => {
    app.strictDrawing.hasRoundOutermostLoop = () => false;
    let calls = 0;
    let pushUndoCall = 0;
    let roundOutermostLoopCall = 0;
    let drawingChangedNotByInteractionCall = 0;
    app.pushUndo = () => { pushUndoCall = ++calls; };
    app.strictDrawing.roundOutermostLoop = () => { roundOutermostLoopCall = ++calls; };
    app.drawingChangedNotByInteraction = () => { drawingChangedNotByInteractionCall = ++calls; };
    let b = createRoundOutermostLoopButtonForApp(app);
    b.props.onClick();
    expect(pushUndoCall).toBe(1);
    expect(roundOutermostLoopCall).toBe(2);
    expect(drawingChangedNotByInteractionCall).toBe(3);
  });
});

describe('disabled prop', () => {
  it('when drawing has round outermost loop', () => {
    app.strictDrawing.hasRoundOutermostLoop = () => true;
    let b = createRoundOutermostLoopButtonForApp(app);
    expect(b.props.disabled).toBeTruthy();
  });

  it('when drawing does not have round outermost loop', () => {
    app.strictDrawing.hasRoundOutermostLoop = () => false;
    let b = createRoundOutermostLoopButtonForApp(app);
    expect(b.props.disabled).toBeFalsy();
  });
});

describe('checked prop', () => {
  it('when drawing has round outermost loop', () => {
    app.strictDrawing.hasRoundOutermostLoop = () => true;
    let b = createRoundOutermostLoopButtonForApp(app);
    expect(b.props.checked).toBeTruthy();
  });

  it('when drawing does not have outermost loop', () => {
    app.strictDrawing.hasRoundOutermostLoop = () => false;
    let b = createRoundOutermostLoopButtonForApp(app);
    expect(b.props.checked).toBeFalsy();
  });
});
