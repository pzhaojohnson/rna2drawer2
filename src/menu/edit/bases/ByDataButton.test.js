import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { ByDataButton } from './ByDataButton';
import { SelectBasesByData } from '../../../forms/annotate/bases/data/SelectBasesByData';

it('onClick callback opens form', () => {
  let app = new App(() => NodeSVG());
  let b = ByDataButton({ app: app });
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  expect(spy.mock.calls[0][0]().type).toBe(SelectBasesByData);
});
