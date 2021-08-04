import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ForcePairButton } from './ForcePairButton';

let app = new App(() => NodeSVG());

it('when not folding', () => {
  app.strictDrawingInteraction.startPivoting();
  let b = ForcePairButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.folding()).toBeTruthy();
  expect(app.strictDrawingInteraction.foldingMode.forcePairing()).toBeTruthy();
});

it('when folding but not force pairing', () => {
  app.strictDrawingInteraction.startFolding();
  app.strictDrawingInteraction.foldingMode.pairComplements();
  let b = ForcePairButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.folding()).toBeTruthy();
  expect(app.strictDrawingInteraction.foldingMode.forcePairing()).toBeTruthy();
});

it('when folding and force pairing', () => {
  app.strictDrawingInteraction.startFolding();
  app.strictDrawingInteraction.foldingMode.forcePair();
  let b = ForcePairButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
  expect(b.props.checked).toBeTruthy();
  expect(() => b.props.onClick()).not.toThrow();
});
