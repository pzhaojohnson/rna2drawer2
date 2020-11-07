import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { RemoveSubsequenceButton } from './RemoveSubsequenceButton';
import { RemoveSubsequence } from '../../../forms/edit/sequence/removeSubsequence/RemoveSubsequence';

let app = new App(() => NodeSVG());
let b = RemoveSubsequenceButton({ app: app });

it('onClick callback renders form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(RemoveSubsequence);
});
