import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { RedoButton } from './RedoButton';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('onClick callback', () => {
  let spy = jest.spyOn(app, 'redo');
  let b = RedoButton({ app: app });
  expect(spy).not.toHaveBeenCalled();
  b.props.onClick();
  expect(spy).toHaveBeenCalled();
});

it('is enabled when can redo', () => {
  app.pushUndo();
  app.undo();
  expect(app.canRedo()).toBeTruthy();
  let b = RedoButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
});

it('is disabled when cannot redo', () => {
  expect(app.canRedo()).toBeFalsy();
  let b = RedoButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
});
