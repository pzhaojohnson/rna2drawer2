import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { EditDropdown } from './EditDropdown';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = EditDropdown({ app: app });
  expect(dd.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = EditDropdown({ app: app });
  expect(dd.props.disabled).toBeFalsy();
});
