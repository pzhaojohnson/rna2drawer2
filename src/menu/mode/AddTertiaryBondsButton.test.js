import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { AddTertiaryBondsButton } from './AddTertiaryBondsButton';

let app = new App(() => NodeSVG());

it('when not folding', () => {
  app.strictDrawingInteraction.startPivoting();
  let b = AddTertiaryBondsButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.folding()).toBeTruthy();
  expect(app.strictDrawingInteraction.foldingMode.onlyAddingTertiaryBonds()).toBeTruthy();
});

it('when folding but not only adding tertiary bonds', () => {
  app.strictDrawingInteraction.startFolding();
  app.strictDrawingInteraction.foldingMode.pairComplements();
  let b = AddTertiaryBondsButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.folding()).toBeTruthy();
  expect(app.strictDrawingInteraction.foldingMode.onlyAddingTertiaryBonds()).toBeTruthy();
});

it('when folding and only adding tertiary bonds', () => {
  app.strictDrawingInteraction.startFolding();
  app.strictDrawingInteraction.foldingMode.onlyAddTertiaryBonds();
  let b = AddTertiaryBondsButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
  expect(b.props.checked).toBeTruthy();
  expect(() => b.props.onClick()).not.toThrow();
});
