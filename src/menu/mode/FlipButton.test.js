import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { FlipButton } from './FlipButton';

let app = new App(() => NodeSVG());

it('when not flipping', () => {
  app.strictDrawingInteraction.startFolding();
  let b = FlipButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.flipping()).toBeTruthy();
});

it('when flipping', () => {
  app.strictDrawingInteraction.startFlipping();
  let b = FlipButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
  expect(b.props.checked).toBeTruthy();
  expect(() => b.props.onClick()).not.toThrow();
});
