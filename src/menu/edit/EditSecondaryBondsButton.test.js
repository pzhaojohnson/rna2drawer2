import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { EditSecondaryBondsButton } from './EditSecondaryBondsButton';
import { EditSecondaryBonds } from '../../forms/edit/secondaryBonds/EditSecondaryBonds';

let app = new App(() => NodeSVG());
let b = EditSecondaryBondsButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditSecondaryBonds);
});
