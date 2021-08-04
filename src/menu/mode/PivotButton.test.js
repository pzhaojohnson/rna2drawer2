import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { PivotButton } from './PivotButton';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

describe('when already pivoting and not just expanding', () => {
  it('is disabled and checked', () => {
    app.strictDrawingInteraction.startPivoting();
    app.strictDrawingInteraction.pivotingMode.addAndRemoveStretch();
    let b = PivotButton({ app: app });
    expect(b.props.disabled).toBeTruthy();
    expect(b.props.checked).toBeTruthy();
  });
});

describe('when pivoting and only expanding', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.startPivoting();
    app.strictDrawingInteraction.pivotingMode.onlyAddStretch();
    let b = PivotButton({ app: app });
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});

describe('when not pivoting', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.startFolding();
    let b = PivotButton({ app: app });
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});

describe('onClick callback', () => {
  it('starts pivoting with adding and removing of stretch', () => {
    app.strictDrawingInteraction.pivotingMode.onlyAddStretch();
    app.strictDrawingInteraction.startFolding();
    let b = PivotButton({ app: app });
    b.props.onClick();
    expect(app.strictDrawingInteraction.pivoting()).toBeTruthy();
    expect(app.strictDrawingInteraction.pivotingMode.addingAndRemovingStretch()).toBeTruthy();
  });
});
