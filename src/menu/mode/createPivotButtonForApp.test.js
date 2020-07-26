import createPivotButtonForApp from './createPivotButtonForApp';

let app = null;

beforeEach(() => {
  app = {
    strictDrawingInteraction: {
      pivoting: () => true,
      startPivoting: () => {},
      pivotingMode: {
        addingAndRemovingStretch: () => {},
        addAndRemoveStretch: () => {},
      },
    },
  };
});

afterEach(() => {
  app = null;
});

it('passes a key and text', () => {
  let pb = createPivotButtonForApp(app);
  expect(pb.key).toBeTruthy();
  expect(pb.props.text).toBe('Pivot');
});

describe('when already pivoting and not just expanding', () => {
  it('is disabled and checked', () => {
    app.strictDrawingInteraction.pivoting = () => true;
    app.strictDrawingInteraction.pivotingMode.addingAndRemovingStretch = () => true;
    let pb = createPivotButtonForApp(app);
    expect(pb.props.disabled).toBeTruthy();
    expect(pb.props.checked).toBeTruthy();
  });
});

describe('when pivoting and only expanding', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.pivoting = () => true;
    app.strictDrawingInteraction.pivotingMode.addingAndRemovingStretch = () => false;
    let pb = createPivotButtonForApp(app);
    expect(pb.props.disabled).toBeFalsy();
    expect(pb.props.checked).toBeFalsy();
  });
});

describe('when not pivoting', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.pivoting = () => false;
    let pb = createPivotButtonForApp(app);
    expect(pb.props.disabled).toBeFalsy();
    expect(pb.props.checked).toBeFalsy();
  });
});

describe('onClick callback', () => {
  it('starts pivoting with adding and removing of stretch', () => {
    app.strictDrawingInteraction.startPivoting = jest.fn();
    app.strictDrawingInteraction.pivotingMode.addAndRemoveStretch = jest.fn();
    let pb = createPivotButtonForApp(app);
    pb.props.onClick();
    expect(app.strictDrawingInteraction.startPivoting).toHaveBeenCalled();
    expect(app.strictDrawingInteraction.pivotingMode.addAndRemoveStretch).toHaveBeenCalled();
  });
});
