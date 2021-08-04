import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { SaveButton } from './SaveButton';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('onClick callback', () => {
  app.save = jest.fn();
  let b = SaveButton({ app: app });
  expect(app.save).not.toHaveBeenCalled();
  b.props.onClick();
  expect(app.save).toHaveBeenCalled();
});

it('when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let b = SaveButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let b = SaveButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
});
