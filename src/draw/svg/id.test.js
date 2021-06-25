import { assignUuid, uuidRegex } from './id';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGElementWrapper as ElementWrapper } from './element';
import { SVGTextWrapper as TextWrapper } from './text';
import { SVGLineWrapper as LineWrapper } from './line';
import { SVGCircleWrapper as CircleWrapper } from './circle';
import { SVGPathWrapper as PathWrapper } from './path';
import { v4 as UUID } from 'uuid';

let container = null;
let svg = null;
let elements = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  elements = [
    new ElementWrapper(svg.rect(10, 20)),
    new TextWrapper(svg.text('asdf')),
    new LineWrapper(svg.line(200, 250, 150, 75)),
    new CircleWrapper(svg.circle(100)),
    new PathWrapper(svg.path('M 2 2 Q 3 4 50 60')),
  ];
});

afterEach(() => {
  elements = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('assignUuid function', () => {
  it('assigns UUIDs', () => {
    elements.forEach(ele => {
      assignUuid(ele);
      let id = ele.id();
      expect(id).toMatch(uuidRegex);
      // double-check the length
      expect(id.length).toBe(37);
      // double-check with the attr method for good measure
      expect(ele.attr('id')).toBe(id);
    });
  });

  it('prepends a letter to assigned UUIDs', () => {
    // all element IDs in an XML document must begin
    // with a letter
    let ele = elements[0];
    let prevId = ele.id();
    for (let i = 0; i < 1e3; i++) {
      assignUuid(ele);
      let currId = ele.id();
      // assigned a new UUID
      expect(currId).not.toEqual(prevId);
      // prepended a letter
      expect(currId.charAt(0)).toBe('i');
      prevId = currId;
    }
  });

  it('overwrites preexisting IDs', () => {
    elements.forEach(ele => {
      let prevId = ele.id(); // initialize ID
      expect(prevId).toBeTruthy();
      assignUuid(ele);
      let currId = ele.id();
      expect(currId).toBeTruthy();
      expect(currId).not.toEqual(prevId);
      // double-check with the attr method for good measure
      expect(ele.attr('id')).toBe(currId);
    });
  });

  it('can initialize IDs', () => {
    // note that the id method of SVG elements will initialize
    // the ID of an element when used as a getter on an element
    // with an undefined ID
    elements.forEach(ele => {
      expect(ele.attr('id')).toBe(undefined);
      assignUuid(ele);
      let id = ele.attr('id');
      expect(id).toBeTruthy();
      // double-check with id method for good measure
      expect(ele.id()).toBe(id);
    });
  });
});

describe('uuidRegex', () => {
  it("matches UUIDs and isn't case-sensitive", () => {
    for (let i = 0; i < 100; i++) {
      let id = UUID();
      expect(id).toMatch(uuidRegex);
      expect(id.toLowerCase()).toMatch(uuidRegex);
      expect(id.toUpperCase()).toMatch(uuidRegex);
    }
  });

  it('detects missing numbers', () => {
    expect('60eb4e57-cdd1-4581-aaa5-a8475bd69387').toMatch(uuidRegex);
    expect('60ebe57-cdd1-4581-aaa5-a8475bd69387').not.toMatch(uuidRegex);
    expect('60eb4e57-dd1-4581-aaa5-a8475bd69387').not.toMatch(uuidRegex);
    expect('60eb4e57-cdd1-481-aaa5-a8475bd69387').not.toMatch(uuidRegex);
    expect('60eb4e57-cdd1-4581-aaa-a8475bd69387').not.toMatch(uuidRegex);
    expect('60eb4e57-cdd1-4581-aaa5-a8475d69387').not.toMatch(uuidRegex);
  });

  it('detects extra numbers in middle sections', () => {
    expect('b5b11075-cc12-4309-8932-e06373a36a13').toMatch(uuidRegex);
    expect('b5b11075-cbc12-4309-8932-e06373a36a13').not.toMatch(uuidRegex);
    expect('b5b11075-cc12-43509-8932-e06373a36a13').not.toMatch(uuidRegex);
    expect('b5b11075-cc12-4309-68932-e06373a36a13').not.toMatch(uuidRegex);
  });

  it('detects missing hyphens', () => {
    expect('2ee6f840-52c1-4adf-b830-ebad0ce4b35f').toMatch(uuidRegex);
    expect('2ee6f84052c1-4adf-b830-ebad0ce4b35f').not.toMatch(uuidRegex);
    expect('2ee6f840-52c14adf-b830-ebad0ce4b35f').not.toMatch(uuidRegex);
    expect('2ee6f840-52c1-4adfb830-ebad0ce4b35f').not.toMatch(uuidRegex);
    expect('2ee6f840-52c1-4adf-b830ebad0ce4b35f').not.toMatch(uuidRegex);
  });
});
