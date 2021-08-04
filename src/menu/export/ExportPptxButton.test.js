import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ExportPptxButton } from './ExportPptxButton';
import ExportPptx from '../../forms/export/pptx/ExportPptx';

it('opens form to export PPTX', () => {
  let app = new App(() => NodeSVG());
  let b = ExportPptxButton({ app: app });
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  expect(spy.mock.calls[0][0]().type).toBe(ExportPptx);
});
