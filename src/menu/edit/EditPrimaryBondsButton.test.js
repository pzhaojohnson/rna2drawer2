import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { EditPrimaryBondsButton } from './EditPrimaryBondsButton';
import { EditPrimaryBonds } from '../../forms/edit/primaryBonds/EditPrimaryBonds';

let app = new App(() => NodeSVG());
let b = EditPrimaryBondsButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditPrimaryBonds);
});
