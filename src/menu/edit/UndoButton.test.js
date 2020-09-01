import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { UndoButton } from './UndoButton';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

it('onClick callback', () => {
  let spy = jest.spyOn(app, 'undo');
  let b = UndoButton({ app: app });
  expect(spy).not.toHaveBeenCalled();
  b.props.onClick();
  expect(spy).toHaveBeenCalled();
});

it('is enabled when can undo', () => {
  app.pushUndo();
  expect(app.canUndo()).toBeTruthy();
  let b = UndoButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
});

it('is disabled when cannot undo', () => {
  expect(app.canUndo()).toBeFalsy();
  let b = UndoButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
});
