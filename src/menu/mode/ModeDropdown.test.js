import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { ModeDropdown } from './ModeDropdown';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = ModeDropdown({ app: app });
  expect(dd.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = ModeDropdown({ app: app });
  expect(dd.props.disabled).toBeFalsy();
});
