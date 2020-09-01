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
  expect(dd.props.topButton.props.disabled).toBeTruthy();
  expect(dd.props.droppedElements.length).toBe(0);
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = EditDropdown({ app: app });
  expect(dd.props.topButton.props.disabled).toBeFalsy();
  expect(dd.props.droppedElements.length).toBeGreaterThan(0);
});
