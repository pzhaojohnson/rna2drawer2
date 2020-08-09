import AnnotateButton from './AnnotateButton';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';

let app = new App(() => NodeSVG());

it('when not annotating', () => {
  app.strictDrawingInteraction.startFolding();
  let b = AnnotateButton(app);
  expect(b.props.disabled).toBeFalsy();
  expect(b.props.checked).toBeFalsy();
  b.props.onClick();
  expect(app.strictDrawingInteraction.annotating()).toBeTruthy();
});

it('when annotating', () => {
  app.strictDrawingInteraction.startAnnotating();
  let b = AnnotateButton(app);
  expect(b.props.disabled).toBeTruthy();
  expect(b.props.checked).toBeTruthy();
  expect(() => b.props.onClick()).not.toThrow();
});
