import { savableState } from './save';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { addNumbering } from './add';

let container = null;
let svg = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'G', 10, 50);
});

afterEach(() => {
  base = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('savableState function', () => {
  it('returns correct values', () => {
    addNumbering(base, 500);
    let textId = Math.random().toString();
    let lineId = Math.random().toString();
    base.numbering.text.id(textId);
    base.numbering.line.id(lineId);
    let state = savableState(base.numbering);
    expect(state).toEqual({
      className: 'BaseNumbering',
      textId: textId,
      lineId: lineId,
    });
  });

  it('returned object can be converted to and from JSON', () => {
    addNumbering(base, 1012);
    let state1 = savableState(base.numbering);
    let string1 = JSON.stringify(state1);
    let state2 = JSON.parse(string1);
    expect(state2).toEqual(state1);
  });
});
