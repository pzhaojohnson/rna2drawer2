import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { EditBaseNumberingButton } from './EditBaseNumberingButton';
import { EditBaseNumbering } from '../../forms/edit/baseNumbering/EditBaseNumbering';

let app = new App(() => NodeSVG());
let b = EditBaseNumberingButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditBaseNumbering);
});
