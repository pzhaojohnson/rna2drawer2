import createExportSvgButtonForApp from './createExportSvgButtonForApp';

jest.mock('../../forms/renderExportSvgInApp');
import renderExportSvgInApp from '../../forms/renderExportSvgInApp';

let app = {};

describe('createExportSvgButtonForApp function', () => {
  let esb = createExportSvgButtonForApp(app);

  it('passes a key', () => {
    expect(esb.key).toBeTruthy();
  });

  it('passes text', () => {
    expect(esb.props.text).toBe('SVG');
  });

  it('passes onClick callback', () => {
    renderExportSvgInApp.mockImplementation(() => {});
    esb.props.onClick();
    expect(renderExportSvgInApp.mock.calls[0][0]).toBe(app);
  });
});
