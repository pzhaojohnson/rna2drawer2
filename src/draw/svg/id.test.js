import { assignUuid } from './id';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGElementWrapper as ElementWrapper } from './element';
import { SVGTextWrapper as TextWrapper } from './text';
import { SVGLineWrapper as LineWrapper } from './line';
import { SVGCircleWrapper as CircleWrapper } from './circle';
import { SVGPathWrapper as PathWrapper } from './path';

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
    let uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    // check that UUID regex matches UUIDs
    expect('6ea2c3ce-1a85-45f8-a0f5-323eb46844a9').toMatch(uuidRegex);
    // missing a number
    expect('6ea2c3ce-1a85-45f8-a0f5-323eb4844a9').not.toMatch(uuidRegex);
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
      expect(currId.charAt(0)).toBe('u');
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
