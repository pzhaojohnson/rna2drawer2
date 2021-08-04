import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ExportDropdown } from './ExportDropdown';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = ExportDropdown({ app: app });
  expect(dd.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = ExportDropdown({ app: app });
  expect(dd.props.disabled).toBeFalsy();
});
