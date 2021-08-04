import {
  findByUniqueId,
  findTextByUniqueId,
  findLineByUniqueId,
  findCircleByUniqueId,
  findRectByUniqueId,
  findPathByUniqueId,
} from './svg';
import { NodeSVG } from 'Draw/svg/NodeSVG';

function areSameElement(ele1, ele2) {
  return (
    ele1.id() // ID is truthy
    && ele1.id() == ele2.id()
    && ele1.svg() // SVG string is truthy
    && ele1.svg() == ele2.svg()
  );
}

let container = null;
let svg = null;

let text = null;
let line = null;
let circle = null;
let rect = null;
let path = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  text = svg.text('asdf');
  line = svg.line(1, 20, 3, 40);
  circle = svg.circle(50);
  rect = svg.rect(20, 200);
  path = svg.path('M 50 60 Q 1000 2000 3 5');
});

afterEach(() => {
  text = null;
  line = null;
  circle = null;
  rect = null;
  path = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('findByUniqueId function', () => {
  it('finds the element with the given ID', () => {
    let id = '789asdjkl';
    circle.id(id);
    let ele = findByUniqueId(svg, id);
    expect(areSameElement(ele, circle)).toBeTruthy();
  });

  it('throws if the ID is not a string', () => {
    [2, {}, true, null, undefined].forEach(id => {
      expect(
        () => findByUniqueId(svg, id)
      ).toThrow();
    });
  });

  it('throws if no element has the given ID', () => {
    let id = 'asdfQWERasdf';
    // no element has the ID
    expect(svg.find('#' + id).length).toBe(0);
    expect(
      () => findByUniqueId(svg, id)
    ).toThrow();
  });

  it('throws if the ID is not unique', () => {
    let id = 'QWERASDFzxcv';
    line.id(id);
    rect.id(id);
    // the two elements have the same ID
    expect(svg.find('#' + id).length).toBe(2);
    expect(
      () => findByUniqueId(svg, id)
    ).toThrow();
  });
});

describe('findTextByUniqueId function', () => {
  it('only finds texts', () => {
    let ele = findTextByUniqueId(svg, text.id());
    expect(areSameElement(ele, text)).toBeTruthy();
    [line, circle, rect, path].forEach(ele => {
      expect(
        () => findTextByUniqueId(svg, ele.id())
      ).toThrow();
    });
  });
});

describe('findLineByUniqueId function', () => {
  it('only finds lines', () => {
    let ele = findLineByUniqueId(svg, line.id());
    expect(areSameElement(ele, line)).toBeTruthy();
    [text, circle, rect, path].forEach(ele => {
      expect(
        () => findLineByUniqueId(svg, ele.id())
      ).toThrow();
    });
  });
});

describe('findCircleByUniqueId function', () => {
  it('only finds circles', () => {
    let ele = findCircleByUniqueId(svg, circle.id());
    expect(areSameElement(ele, circle)).toBeTruthy();
    [text, line, rect, path].forEach(ele => {
      expect(
        () => findCircleByUniqueId(svg, ele.id())
      ).toThrow();
    });
  });
});

describe('findRectByUniqueId function', () => {
  it('only finds rects', () => {
    let ele = findRectByUniqueId(svg, rect.id());
    expect(areSameElement(ele, rect)).toBeTruthy();
    [text, line, circle, path].forEach(ele => {
      expect(
        () => findRectByUniqueId(svg, ele.id())
      ).toThrow();
    });
  });
});

describe('findPathByUniqueId function', () => {
  it('only finds paths', () => {
    let ele = findPathByUniqueId(svg, path.id());
    expect(areSameElement(ele, path)).toBeTruthy();
    [text, line, circle, rect].forEach(ele => {
      expect(
        () => findPathByUniqueId(svg, ele.id())
      ).toThrow();
    });
  });
});
