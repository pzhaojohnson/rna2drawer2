import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { TriangularizeButton } from './TriangularizeButton';

let app = new App(() => NodeSVG());

it('when not triangularizing', () => {
  app.strictDrawingInteraction.startFolding();
  let b = TriangularizeButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.triangularizing()).toBeTruthy();
});

it('when triangularizing', () => {
  app.strictDrawingInteraction.startTriangularizing();
  let b = TriangularizeButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
  expect(b.props.checked).toBeTruthy();
  expect(() => b.props.onClick()).not.toThrow();
});
