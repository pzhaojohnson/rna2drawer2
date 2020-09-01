import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { PairComplementsButton } from './PairComplementsButton';

let app = new App(() => NodeSVG());

it('when not folding', () => {
  app.strictDrawingInteraction.startPivoting();
  let b = PairComplementsButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.folding()).toBeTruthy();
  expect(app.strictDrawingInteraction.foldingMode.pairingComplements()).toBeTruthy();
});

it('when folding but not pairing complements', () => {
  app.strictDrawingInteraction.startFolding();
  app.strictDrawingInteraction.foldingMode.forcePair();
  let b = PairComplementsButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.folding()).toBeTruthy();
  expect(app.strictDrawingInteraction.foldingMode.pairingComplements()).toBeTruthy();
});

it('when folding and pairing complements', () => {
  app.strictDrawingInteraction.startFolding();
  app.strictDrawingInteraction.foldingMode.pairComplements();
  let b = PairComplementsButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
  expect(b.props.checked).toBeTruthy();
  expect(() => b.props.onClick()).not.toThrow();
});
