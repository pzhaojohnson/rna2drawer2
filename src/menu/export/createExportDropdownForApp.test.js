import createExportDropdownForApp from './createExportDropdownForApp';

jest.mock('./createExportSvgButtonForApp');
import createExportSvgButtonForApp from './createExportSvgButtonForApp';

jest.mock('./createExportPptxButtonForApp');
import createExportPptxButtonForApp from './createExportPptxButtonForApp';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
};

describe('passes top button', () => {
  it('with text', () => {
    let ed = createExportDropdownForApp(app);
    let tb = ed.props.topButton;
    expect(tb.props.text).toBe('Export');
  });

  it('when drawing is empty', () => {
    app.strictDrawing.isEmpty = () => true;
    let ed = createExportDropdownForApp(app);
    let tb = ed.props.topButton;
    expect(tb.props.disabled).toBeTruthy();
  });

  it('when drawing is not empty', () => {
    app.strictDrawing.isEmpty = () => false;
    let ed = createExportDropdownForApp(app);
    let tb = ed.props.topButton;
    expect(tb.props.disabled).toBeFalsy();
  });
});

describe('passes dropped elements', () => {
  it('when drawing is empty', () => {
    app.strictDrawing.isEmpty = () => true;
    let ed = createExportDropdownForApp(app);
    let des = ed.props.droppedElements;
    expect(des.length).toBe(0);
  });

  describe('when drawing is not empty', () => {
    createExportSvgButtonForApp.mockImplementation(() => 'ExportSvgButton');
    createExportPptxButtonForApp.mockImplementation(() => 'ExportPptxButton');
    app.strictDrawing.isEmpty = () => false;
    let ed = createExportDropdownForApp(app);
    let des = ed.props.droppedElements;

    it('passes app to create button functions', () => {
      expect(createExportSvgButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createExportPptxButtonForApp.mock.calls[0][0]).toBe(app);
    });

    it('passes buttons', () => {
      expect(des[0]).toBe('ExportSvgButton');
      expect(des[1]).toBe('ExportPptxButton');
    });
  });
});
