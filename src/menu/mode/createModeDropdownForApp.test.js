import createModeDropdownForApp from './createModeDropdownForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';

it('renders when drawing is empty', () => {
  let app = new App(() => NodeSVG());
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = createModeDropdownForApp(app);
  expect(dd.props.droppedElements.length).toBe(0);
});

it('renders when drawing is not empty', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = createModeDropdownForApp(app);
  expect(dd.props.droppedElements.length).toBeGreaterThan(0);
});
