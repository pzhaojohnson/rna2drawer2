import createExpandButtonForApp from './createExpandButtonForApp';

let app = null;

beforeEach(() => {
  app = {
    strictDrawingInteraction: {
      pivoting: () => {},
      startPivoting: () => {},
      pivotingMode: {
        onlyAddingStretch: () => {},
        onlyAddStretch: () => {},
      },
    },
  };
});

afterEach(() => {
  app = null;
});

it('is created with a key and text', () => {
  let b = createExpandButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Pivot (Expand)');
});

describe('when already expanding', () => {
  it('is disabled and checked', () => {
    app.strictDrawingInteraction.pivoting = () => true;
    app.strictDrawingInteraction.pivotingMode.onlyAddingStretch = () => true;
    let b = createExpandButtonForApp(app);
    expect(b.props.disabled).toBeTruthy();
    expect(b.props.checked).toBeTruthy();
  });
});

describe('when pivoting but not just expanding', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.pivoting = () => true;
    app.strictDrawingInteraction.pivotingMode.onlyAddingStretch = () => false;
    let b = createExpandButtonForApp(app);
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});

describe('when not pivoting', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.pivoting = () => false;
    let b = createExpandButtonForApp(app);
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});

describe('onClick callback', () => {
  it('starts pivoting with only adding of stretch', () => {
    app.strictDrawingInteraction.startPivoting = jest.fn();
    app.strictDrawingInteraction.pivotingMode.onlyAddStretch = jest.fn();
    let b = createExpandButtonForApp(app);
    b.props.onClick();
    expect(app.strictDrawingInteraction.startPivoting).toHaveBeenCalled();
    expect(app.strictDrawingInteraction.pivotingMode.onlyAddStretch).toHaveBeenCalled();
  });
});
