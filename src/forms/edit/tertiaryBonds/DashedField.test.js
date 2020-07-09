import DashedField from './DashedField';
import { TertiaryBond } from '../../../draw/QuadraticBezierBond';

let app = null;
let pushUndoSpy = null;
let renderPeripheralsSpy = null;

beforeEach(() => {
  app = {
    strictDrawingInteraction: {
      tertiaryBondsInteraction: {},
    },
    pushUndo: () => {},
    renderPeripherals: () => {},
  };
  pushUndoSpy = jest.spyOn(app, 'pushUndo');
  renderPeripheralsSpy = jest.spyOn(app, 'renderPeripherals');
});

afterEach(() => {
  app = null;
});

describe('create static method', () => {
  describe('passing whether the selected tertiary bond is dashed', () => {
    it('when no tertiary bond is selected', () => {
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = DashedField.create(app);
      expect(ele.props.isDashed).toBeFalsy();
    });

    it('when the selected tertiary bond is dashed', () => {
      let selected = { strokeDasharray: '8 2' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = DashedField.create(app);
      expect(ele.props.isDashed).toBeTruthy();
    });

    it('when the selected tertiary bond is not dashed', () => {
      let selected = { strokeDasharray: '' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = DashedField.create(app);
      expect(ele.props.isDashed).toBeFalsy();
    });
  });

  describe('set callback', () => {
    it('has no effect when no tertiary bond is selected', () => {
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = undefined;
      let ele = DashedField.create(app);
      ele.props.set(true);
      expect(pushUndoSpy).not.toHaveBeenCalled();
      expect(renderPeripheralsSpy).not.toHaveBeenCalled();
    });

    it('has no effect if setting to the same dashed state', () => {
      let selected = { strokeDasharray: '8 2' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = DashedField.create(app);
      ele.props.set(true);
      selected.strokeDasharray = '';
      ele.props.set(false);
      expect(pushUndoSpy).not.toHaveBeenCalled();
      expect(renderPeripheralsSpy).not.toHaveBeenCalled();
    });

    it('can make dashed', () => {
      let selected = { strokeDasharray: '' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = DashedField.create(app);
      ele.props.set(true);
      expect(selected.strokeDasharray).toBe(TertiaryBond.defaultStrokeDasharray);
      expect(pushUndoSpy).toHaveBeenCalled(); // pushes undo
      expect(renderPeripheralsSpy).toHaveBeenCalled(); // refreshes app
    });

    it('can remove dashes', () => {
      let selected = { strokeDasharray: '8 2' };
      app.strictDrawingInteraction.tertiaryBondsInteraction.selected = selected;
      let ele = DashedField.create(app);
      ele.props.set(false);
      expect(selected.strokeDasharray).toBe('');
      expect(pushUndoSpy).toHaveBeenCalled(); // pushes undo
      expect(renderPeripheralsSpy).toHaveBeenCalled(); // refreshes app
    });
  });
});

describe('render method', () => {
  it('renders with a name', () => {
    let comp = new DashedField({ isDashed: true });
    expect(comp.render().props.name).toBeTruthy();
  });

  it('can render checked and unchecked', () => {
    let comp = new DashedField({ isDashed: true });
    expect(comp.render().props.initialValue).toBe(true);
    comp = new DashedField({ isDashed: false });
    expect(comp.render().props.initialValue).toBe(false);
  });

  it('passes value between set callbacks', () => {
    let set = jest.fn();
    let comp = new DashedField({ isDashed: true, set: set });
    let ele = comp.render();
    ele.props.set(false);
    expect(set.mock.calls[0][0]).toBe(false);
    ele.props.set(true);
    expect(set.mock.calls[1][0]).toBe(true);
  });
});
