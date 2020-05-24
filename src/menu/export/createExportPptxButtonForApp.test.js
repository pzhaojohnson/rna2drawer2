import createExportPptxButtonForApp from './createExportPptxButtonForApp';

jest.mock('../../forms/renderExportPptxInApp');
import renderExportPptxInApp from '../../forms/renderExportPptxInApp';

let app = {};

describe('createExportPptxButtonForApp function', () => {
  let epb = createExportPptxButtonForApp(app);

  it('passes a key', () => {
    expect(epb.key).toBeTruthy();
  });

  it('passes text', () => {
    expect(epb.props.text).toBe('PowerPoint (PPTX)');
  });

  it('passes onClick callback', () => {
    renderExportPptxInApp.mockImplementation(() => {});
    epb.props.onClick();
    expect(renderExportPptxInApp.mock.calls[0][0]).toBe(app);
  });
});
