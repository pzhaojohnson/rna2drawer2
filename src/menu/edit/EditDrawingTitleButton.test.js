import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { EditDrawingTitleButton } from './EditDrawingTitleButton';
import { EditDrawingTitle } from '../../forms/edit/drawingTitle/EditDrawingTitle';

let app = new App(() => NodeSVG());
let b = EditDrawingTitleButton({ app: app });

it('onClick callback opens form', () => {
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  let factory = spy.mock.calls[0][0];
  expect(factory().type).toBe(EditDrawingTitle);
});
