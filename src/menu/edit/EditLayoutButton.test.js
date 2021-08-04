import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { EditLayoutButton } from './EditLayoutButton';
import EditLayout from '../../forms/edit/layout/EditLayout';

let app = new App(() => NodeSVG());
let b = EditLayoutButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditLayout);
});
