import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ExportSvgButton } from './ExportSvgButton';
import ExportSvg from '../../forms/export/svg/ExportSvg';

it('opens form to export SVG', () => {
  let app = new App(() => NodeSVG());
  let spy = jest.spyOn(app, 'renderForm');
  let b = ExportSvgButton({ app: app });
  b.props.onClick();
  expect(spy.mock.calls[0][0]().type).toBe(ExportSvg);
});
