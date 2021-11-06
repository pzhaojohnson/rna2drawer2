import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { EditNumberingButton } from './EditNumberingButton';
import { EditNumbering } from 'Forms/edit/EditNumbering';

let app = new App(() => NodeSVG());
let b = EditNumberingButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditNumbering);
});
