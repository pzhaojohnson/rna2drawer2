import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { SettingsDropdown } from './SettingsDropdown';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = SettingsDropdown({ app: app });
  expect(dd.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = SettingsDropdown({ app: app });
  expect(dd.props.disabled).toBeFalsy();
});
