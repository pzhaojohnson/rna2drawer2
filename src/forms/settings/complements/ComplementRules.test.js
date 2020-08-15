import ComplementRules from './ComplementRules';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';

let app = new App(() => NodeSVG());

it('renders', () => {
  expect(ComplementRules(app)).toBeTruthy();
});
