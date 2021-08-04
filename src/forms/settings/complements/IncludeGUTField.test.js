import IncludeGUTField from './IncludeGUTField';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

let app = new App(() => NodeSVG());

it('set callback sets folding mode property', () => {
  let mode = app.strictDrawingInteraction.foldingMode;
  mode.includeGUT = true;
  let f = IncludeGUTField(app);
  f.props.set(true);
  expect(mode.includeGUT).toBeTruthy();
  f.props.set(false);
  expect(mode.includeGUT).toBeFalsy();
});
