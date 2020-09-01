import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { ExpandButton } from './ExpandButton';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

describe('when already expanding', () => {
  it('is disabled and checked', () => {
    app.strictDrawingInteraction.startPivoting();
    app.strictDrawingInteraction.pivotingMode.onlyAddStretch();
    let b = ExpandButton({ app: app });
    expect(b.props.disabled).toBeTruthy();
    expect(b.props.checked).toBeTruthy();
  });
});

describe('when pivoting but not just expanding', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.startPivoting();
    app.strictDrawingInteraction.pivotingMode.addAndRemoveStretch();
    let b = ExpandButton({ app: app });
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});

describe('when not pivoting', () => {
  it('is enabled and not checked', () => {
    app.strictDrawingInteraction.startFolding();
    let b = ExpandButton({ app: app });
    expect(b.props.disabled).toBeFalsy();
    expect(b.props.checked).toBeFalsy();
  });
});

describe('onClick callback', () => {
  it('starts pivoting with only adding of stretch', () => {
    app.strictDrawingInteraction.pivotingMode.addAndRemoveStretch();
    app.strictDrawingInteraction.startFolding();
    let b = ExpandButton({ app: app });
    b.props.onClick();
    expect(app.strictDrawingInteraction.pivoting()).toBeTruthy();
    expect(app.strictDrawingInteraction.pivotingMode.onlyAddingStretch()).toBeTruthy();
  });
});
