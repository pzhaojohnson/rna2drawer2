import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { InsertSubsequenceButton } from './InsertSubsequenceButton';
import { InsertSubsequence } from '../../../forms/edit/sequence/insertSubsequence/InsertSubsequence';

let app = new App(() => NodeSVG());
let b = InsertSubsequenceButton({ app: app });

it('onClick callback renders form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(InsertSubsequence);
});
