import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { ExportDropdown } from './ExportDropdown';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = ExportDropdown({ app: app });
  expect(dd.props.topButton.props.disabled).toBeTruthy();
  expect(dd.props.dropped.props.children.length).toBe(0);
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = ExportDropdown({ app: app });
  expect(dd.props.topButton.props.disabled).toBeFalsy();
  expect(dd.props.dropped.props.children.length).toBeGreaterThan(0);
});
