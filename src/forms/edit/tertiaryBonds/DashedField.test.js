import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import {
  isDashed,
  areAllDashed,
  areAllNotDashed,
  DashedField,
} from './DashedField';


let app = new App(() => NodeSVG());
app.strictDrawing.appendSequence('asdf', 'asdfasdfasdfasdfasdf');
let drawing = app.strictDrawing.drawing;
let seq = drawing.getSequenceAtIndex(0);
let b1 = seq.getBaseAtPosition(1);
let b2 = seq.getBaseAtPosition(2);
let b3 = seq.getBaseAtPosition(3);
let b4 = seq.getBaseAtPosition(4);
let tb1 = drawing.addTertiaryBond(b1, b2);
let tb2 = drawing.addTertiaryBond(b3, b4);
let tb3 = drawing.addTertiaryBond(b4, b2);

it('isDashed function', () => {
  tb1.strokeDasharray = '';
  expect(isDashed(tb1)).toBeFalsy();
  tb1.strokeDasharray = 'none';
  expect(isDashed(tb1)).toBeFalsy();
  tb1.strokeDasharray = '2 1';
  expect(isDashed(tb1)).toBeTruthy();
});

describe('areAllDashed function', () => {
  it('are all dashed', () => {
    tb1.strokeDasharray = '2 1';
    tb2.strokeDasharray = '3 3';
    tb3.strokeDasharray = '5 1';
    expect(areAllDashed([tb1, tb2, tb3])).toBeTruthy();
  });

  it('one is not dashed', () => {
    tb1.strokeDasharray = '5 6';
    tb2.strokeDasharray = '';
    tb3.strokeDasharray = '1 2';
    expect(areAllDashed([tb1, tb2, tb3])).toBeFalsy();
  });
});

describe('areAllNotDashed function', () => {
  it('are all not dashed', () => {
    tb1.strokeDasharray = '';
    tb2.strokeDasharray = 'none';
    tb3.strokeDasharray = '';
    expect(areAllNotDashed([tb1, tb2, tb3])).toBeTruthy();
  });

  it('one is dashed', () => {
    tb1.strokeDasharray = '';
    tb2.strokeDasharray = 'none';
    tb3.strokeDasharray = '1 5';
    expect(areAllNotDashed([tb1, tb2, tb3])).toBeFalsy();
  });
});

describe('field', () => {
  let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;

  it('renders when no tertiary bonds are selected', () => {
    interaction.selected.clear();
    expect(
      () => DashedField({ app: app })
    ).not.toThrow();
  });

  it('renders when tertiary bonds are selected', () => {
    interaction.selected.add(tb1.id);
    interaction.selected.add(tb2.id);
    expect(
      () => DashedField({ app: app })
    ).not.toThrow();
  });
});
