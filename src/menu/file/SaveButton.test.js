import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { SaveButton } from './SaveButton';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let b = SaveButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let b = SaveButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
});
