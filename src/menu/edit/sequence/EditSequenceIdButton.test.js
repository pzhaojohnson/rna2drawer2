import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { EditSequenceIdButton } from './EditSequenceIdButton';
import { EditSequenceId } from '../../../forms/edit/sequence/id/EditSequenceId';

let app = new App(() => NodeSVG());
let b = EditSequenceIdButton({ app: app });

it('onClick callback renders form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditSequenceId);
});
