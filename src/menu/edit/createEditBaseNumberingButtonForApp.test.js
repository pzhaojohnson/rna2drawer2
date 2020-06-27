import createEditBaseNumberingButtonForApp from './createEditBaseNumberingButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import * as RenderEditBaseNumberingInApp from '../../forms/renderEditBaseNumberingInApp';

let app = new App(() => NodeSVG());
let b = createEditBaseNumberingButtonForApp(app);

it('creates with key', () => {
  expect(b.key).toBeTruthy();
});

it('creates with text', () => {
  expect(b.props.text).toBe('Numbering');
});

it('onClick callback opens form', () => {
  let spy = jest.spyOn(RenderEditBaseNumberingInApp, 'renderEditBaseNumberingInApp');
  b.props.onClick();
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toBe(app);
});
