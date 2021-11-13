import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ByDataButton } from './ByDataButton';
import { BasesByData } from 'Forms/edit/bases/by/data/BasesByData';

it('onClick callback opens form', () => {
  let app = new App(() => NodeSVG());
  let b = ByDataButton({ app: app });
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  expect(spy.mock.calls[0][0]().type).toBe(BasesByData);
});
