import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { AnnotateDropdown } from './AnnotateDropdown';

it('is disabled when drawing empty', () => {
  let app = new App(() => NodeSVG());
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let dd = AnnotateDropdown({ app: app });
  expect(dd.props.disabled).toBeTruthy();
});

it('is enabled when drawing is not empty', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let dd = AnnotateDropdown({ app: app });
  expect(dd.props.disabled).toBeFalsy();
});
