import createEditBaseNumberingButtonForApp from './createEditBaseNumberingButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import EditBaseNumbering from '../../forms/edit/baseNumbering/EditBaseNumbering';

let app = new App(() => NodeSVG());
let b = createEditBaseNumberingButtonForApp(app);

it('creates with key', () => {
  expect(b.key).toBeTruthy();
});

it('creates with text', () => {
  expect(b.props.text).toBe('Numbering');
});

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditBaseNumbering);
});
