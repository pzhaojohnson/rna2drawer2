import createEditSequenceIdButtonForApp from './createEditSequenceIdButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import EditSequenceId from '../../forms/edit/sequenceId/EditSequenceId';

let app = new App(() => NodeSVG());
let b = createEditSequenceIdButtonForApp(app);

it('creates with key', () => {
  expect(b.key).toBeTruthy();
});

it('creates with text', () => {
  expect(b.props.text).toBe('Sequence ID');
});

it('onClick callback renders form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditSequenceId);
});
