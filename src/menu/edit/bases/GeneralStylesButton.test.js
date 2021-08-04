import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { GeneralStylesButton } from './GeneralStylesButton';
import { GeneralBaseStyles } from '../../../forms/edit/bases/generalStyles/GeneralBaseStyles';

let app = new App(() => NodeSVG());
let b = GeneralStylesButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(GeneralBaseStyles);
});
