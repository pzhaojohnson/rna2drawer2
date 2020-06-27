import createEditSequenceIdButtonForApp from './createEditSequenceIdButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import * as RenderEditSequenceIdInApp from '../../forms/renderEditSequenceIdInApp';

let app = new App(() => NodeSVG());
let b = createEditSequenceIdButtonForApp(app);

it('creates with key', () => {
  expect(b.key).toBeTruthy();
});

it('creates with text', () => {
  expect(b.props.text).toBe('Sequence ID');
});

it('onClick callback renders form', () => {
  let spy = jest.spyOn(RenderEditSequenceIdInApp, 'renderEditSequenceIdInApp');
  b.props.onClick();
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toBe(app);
});
