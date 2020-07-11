import prettyFormat from 'pretty-format';
import { ColorField, PRESET_COLORS } from './ColorField';

describe('render method', () => {
  it('shows and hides picker as toggled', () => {
    let comp = new ColorField({});
    expect(comp.state.showPicker).toBe(false);
    let ele = comp.render();
    let shown = prettyFormat(ele.props.children[1]);
    let display = prettyFormat(comp.currentColorDisplay());
    expect(shown).toBe(display);

    comp.state.showPicker = true;
    ele = comp.render();
    shown = prettyFormat(ele.props.children[1]);
    let picker = prettyFormat(comp.picker());
    expect(shown).toBe(picker);

    comp.state.showPicker = false;
    ele = comp.render();
    shown = prettyFormat(ele.props.children[1]);
    display = prettyFormat(comp.currentColorDisplay());
    expect(shown).toBe(display);
  });
});

describe('label', () => {
  it('shows field name when picker is shown and not shown', () => {
    let comp = new ColorField({ name: 'asdf qwer'});
    comp.state.showPicker = false; // picker is not shown
    let label = comp.label();
    expect(prettyFormat(label).includes('asdf qwer:')).toBeTruthy();

    comp.state.showPicker = true; // picker is shown
    label = comp.label();
    expect(prettyFormat(label).includes('asdf qwer:')).toBeTruthy();
  });

  it('can be clicked to hide picker', () => {
    let comp = new ColorField({});
    comp.state.showPicker = true; // picker is shown
    let label = comp.label();
    let spy = jest.spyOn(comp, 'setState');
    label.props.onClick();
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].showPicker).toBe(false);
  });
});

describe('current color display', () => {
  it('displays current color if provided', () => {
    let comp = new ColorField({ initialValue: '#00ffaa' });
    let display = comp.currentColorDisplay();
    expect(display.props.style.backgroundColor).toBe('#00ffaa');
  });

  it('displays black if no current color is provided', () => {
    let comp = new ColorField({});
    let display = comp.currentColorDisplay();
    expect(display.props.style.backgroundColor).toBe('#000000');
  });

  it('toggles picker to be shown when clicked', () => {
    let comp = new ColorField({});
    let spy = jest.spyOn(comp, 'setState');
    let display = comp.currentColorDisplay();
    expect(spy).not.toHaveBeenCalled();
    display.props.onClick();
    // sets state
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].showPicker).toBe(true);
  });
});

describe('picker', () => {
  it('shows current color if provided', () => {
    let comp = new ColorField({ initialValue: '#00abef' });
    let picker = comp.picker();
    expect(picker.props.color).toBe('#00abef');
  });

  it('shows black if no current color provided', () => {
    let comp = new ColorField({});
    let picker = comp.picker();
    expect(picker.props.color).toBe('#000000');
    // preset colors should also include black
    expect(PRESET_COLORS.includes('#000000')).toBeTruthy();
  });

  it('preset colors fit evenly into rows', () => {
    let comp = new ColorField({ initialValue: '#000000' });
    let picker = comp.picker();
    let width = Number.parseInt(picker.props.width);
    expect(Number.isFinite(width)).toBeTruthy();
    expect(width).toBeGreaterThan(0);
    let fitInRow = Math.floor(width / (picker.props.circleSize + picker.props.circleSpacing));
    expect(PRESET_COLORS.length % fitInRow).toBe(0);
  });

  describe('showing custom colors', () => {
    it('when the given color is one of the preset colors', () => {
      let color = PRESET_COLORS[5].toLowerCase();
      // hex code does have letters that were decapitalized
      expect(color).not.toBe(PRESET_COLORS[5]);
      ColorField.customColors = [];
      let comp = new ColorField({ initialValue: color });
      let picker = comp.picker();
      // is displayed as a preset color
      expect(picker.props.colors.toString()).toBe(PRESET_COLORS.toString());
      // was not added to custom colors list
      expect(ColorField.customColors.length).toBe(0);
    });

    it('when the custom color has not been seen before', () => {
      let color = '#abcdef';
      expect(PRESET_COLORS.includes(color.toUpperCase())).toBeFalsy();
      ColorField.customColors = ['#00AA22', '#BBC233'];
      let comp = new ColorField({ initialValue: color });
      let picker = comp.picker();
      // is displayed at front of custom colors row
      expect(picker.props.colors.toString()).toBe(
        PRESET_COLORS.concat(['#ABCDEF', '#00AA22', '#BBC233']).toString()
      );
      // was added to front of custom colors list
      expect(ColorField.customColors.toString()).toBe(['#ABCDEF', '#00AA22', '#BBC233'].toString());
    });

    it('when the custom color has been seen before', () => {
      let color = '#aabbcc';
      expect(PRESET_COLORS.includes(color.toUpperCase())).toBeFalsy();
      ColorField.customColors = ['#00BBB2', '#AABBCC', '#330011'];
      let comp = new ColorField({ initialValue: color });
      let picker = comp.picker();
      // is displayed at front of custom colors row
      expect(picker.props.colors.toString()).toBe(
        PRESET_COLORS.concat(['#AABBCC', '#00BBB2', '#330011']).toString()
      );
      // is moved to front of custom colors list
      expect(ColorField.customColors.toString()).toBe(['#AABBCC', '#00BBB2', '#330011'].toString());
    });
  });

  describe('onChangeComplete callback', () => {
    let set = jest.fn();
    let comp = new ColorField({ initialValue: '#000000', set: set });
    let picker = comp.picker();

    it('handles hex codes of lengths 4 and 7', () => {
      set.mockClear();
      picker.props.onChangeComplete({ hex: '#00abdd' });
      expect(set.mock.calls[0][0]).toBe('#00abdd');

      set.mockClear();
      picker.props.onChangeComplete({ hex: '#fa2' });
      expect(set.mock.calls[0][0]).toBe('#ffaa22');
    });

    it('converts hex code to lower case', () => {
      set.mockClear();
      picker.props.onChangeComplete({ hex: '#AB12BA' }); // 7 characters
      expect(set.mock.calls[0][0]).toBe('#ab12ba');

      set.mockClear();
      picker.props.onChangeComplete({ hex: '#AC2' }); // 4 characters
      expect(set.mock.calls[0][0]).toBe('#aacc22');
    });
  });
});
