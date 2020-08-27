import EditTertiaryBond from './EditTertiaryBond';
import prettyFormat from 'pretty-format';

let app = null;

beforeEach(() => {
  app = {
    strictDrawingInteraction: {
      tertiaryBondsInteraction: {},
    },
    unmountCurrForm: () => {},
  };
});

afterEach(() => {
  app = null;
});

describe('create static method', () => {
  it('close callback unmounts form', () => {
    let spy = jest.spyOn(app, 'unmountCurrForm');
    let ele = EditTertiaryBond.create(app);
    expect(spy).not.toHaveBeenCalled();
    ele.props.close();
    expect(spy).toHaveBeenCalled();
  });

  it('when no tertiary is selected', () => {
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
    let ele = EditTertiaryBond.create(app);
    expect(ele.props.noSelection).toBeTruthy();
    expect(ele.props.strokeField).toBeFalsy();
    expect(ele.props.strokeWidthField).toBeFalsy();
    expect(ele.props.dashedField).toBeFalsy();
    expect(ele.props.paddingField1).toBeFalsy();
    expect(ele.props.paddingField2).toBeFalsy();
  });

  it('when a tertiary bond is selected', () => {
    let selected = {
      stroke: '#000000',
      strokeWidth: 1,
      strokeDasharray: '',
      padding1: 8.8,
      padding2: 4.902,
    };
    app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
    let ele = EditTertiaryBond.create(app);
    expect(ele.props.noSelection).toBeFalsy();
    expect(ele.props.strokeField).toBeTruthy();
    expect(ele.props.strokeWidthField).toBeTruthy();
    expect(ele.props.dashedField).toBeTruthy();
    expect(ele.props.paddingField1).toBeTruthy();
    expect(ele.props.paddingField2).toBeTruthy();
  });
});

describe('render method', () => {
  it('binds close callback', () => {
    let close = jest.fn();
    let comp = new EditTertiaryBond({ close: close });
    let ele = comp.render();
    expect(close).not.toHaveBeenCalled();
    ele.props.close();
    expect(close).toHaveBeenCalled();
  });

  it('with no selection', () => {
    let comp = new EditTertiaryBond({
      noSelection: true,
      strokeField: 'Stroke Field',
      strokeWidthField: 'Stroke Width Field',
      dashedField: 'Dashed Field',
    });
    let ele = comp.render();
    let contained = prettyFormat(ele.props.contained);
    // indicates that no tertiary bond is selected
    expect(contained.includes('No tertiary bond is selected.')).toBeTruthy();
    // does not render fields
    expect(contained.includes('Field')).toBeFalsy();
  });

  it('with a selection', () => {
    let comp = new EditTertiaryBond({
      noSelection: false,
      strokeField: 'Stroke Field',
      strokeWidthField: 'Stroke Width Field',
      dashedField: 'Dashed Field',
      paddingField1: 'Padding Field 1',
      paddingField2: 'Padding Field 2',
    });
    let ele = comp.render();
    let contained = prettyFormat(ele.props.contained);
    // does not say that no tertiary bond is selected
    expect(contained.includes('No tertiary bond is selected.')).toBeFalsy();
    // renders fields
    expect(contained.includes('Stroke Field')).toBeTruthy();
    expect(contained.includes('Stroke Width Field')).toBeTruthy();
    expect(contained.includes('Dashed Field')).toBeTruthy();
    expect(contained.includes('Padding Field 1')).toBeTruthy();
    expect(contained.includes('Padding Field 2')).toBeTruthy();
  });
});
