import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { EditTertiaryBondsButton } from './EditTertiaryBondsButton';
import { EditTertiaryBond } from '../../forms/edit/tertiaryBonds/EditTertiaryBond';

let app = new App(() => NodeSVG());
let b = EditTertiaryBondsButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditTertiaryBond);
});
