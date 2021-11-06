import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { EditSequenceIdButton } from './EditSequenceIdButton';
import { EditSequenceId } from 'Forms/edit/sequence/EditSequenceId';

let app = new App(() => NodeSVG());
let b = EditSequenceIdButton({ app: app });

it('onClick callback renders form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditSequenceId);
});
