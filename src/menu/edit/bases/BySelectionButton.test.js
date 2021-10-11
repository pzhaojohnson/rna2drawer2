import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { BySelectionButton } from './BySelectionButton';

let app = new App(() => NodeSVG());

it('when not annotating', () => {
  app.strictDrawingInteraction.startFolding();
  let b = BySelectionButton({ app: app });
  b.props.onClick();
  expect(app.strictDrawingInteraction.annotating()).toBeTruthy();
});

it('when already annotating', () => {
  app.strictDrawingInteraction.startAnnotating();
  let b = BySelectionButton({ app: app });
  app.unmountForm();
  // form to annotate bases is closed
  expect(document.body.textContent.includes('Edit Bases')).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.annotating()).toBeTruthy();
  // reopens form to annotate bases even if already annotating
  expect(document.body.textContent.includes('Edit Bases')).toBeTruthy();
});
