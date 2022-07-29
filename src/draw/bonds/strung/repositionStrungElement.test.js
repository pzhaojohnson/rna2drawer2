import { NodeSVG } from 'Draw/svg/NodeSVG';

import { repositionStrungElement } from './repositionStrungElement';

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('repositionStrungElement function', () => {
  test('a strung text', () => {
    let text = {
      type: 'StrungText',
      text: svg.text('W'),
      displacementFromCenter: 4,
      displacementFromCurve: { x: 3, y: -8 },
    };
    let p = {
      curve: { startPoint: { x: 6, y: 7 }, endPoint: { x: -6, y: 12 } },
      curveLength: 13,
    };
    repositionStrungElement(text, p);
    expect(text.text.cx()).toBeCloseTo(2.538461538461539);
    expect(text.text.cy()).toBeCloseTo(5.192307692307692);
  });

  test('a strung circle', () => {
    let circle = {
      type: 'StrungCircle',
      circle: svg.circle(20),
      displacementFromCenter: 3,
      displacementFromCurve: { x: 1.5, y: 2.3 },
    };
    let p = {
      curve: { startPoint: { x: -1 , y: 2 }, endPoint: { x: 2, y: -2 } },
      curveLength: 5,
    };
    repositionStrungElement(circle, p);
    expect(circle.circle.attr('cx')).toBeCloseTo(4.58);
    expect(circle.circle.attr('cy')).toBeCloseTo(-2.94);
  });

  test('a strung triangle', () => {
    let triangle = {
      type: 'StrungTriangle',
      path: svg.path('M 10 20 L 30 40'),
      width: 12,
      height: 24,
      tailsHeight: 4,
      rotation: 0.1,
      displacementFromCenter: -2,
      displacementFromCurve: { x: -8, y: -17 },
    };
    let p = {
      curve: {
        startPoint: { x: 1765.3529736798957, y: 1557.9914603008992 },
        controlPoint: { x: 1733.83356263873, y: 1476.749954960175 },
        endPoint: { x: 1803.5438541779154, y: 1403.2166963737411 },
      },
      curveLength: 169.4010009765625,
    };
    repositionStrungElement(triangle, p);
    let d = triangle.path.attr('d');
    expect(d).toBe('M 1750.937758709718 1483.9043195179402 L 1748.9096539865855 1508.5596798120425 L 1744.512703967241 1502.8441894107395 L 1737.5457320509058 1504.7046469665563 Z');
  });

  test('a strung rectangle', () => {
    let rectangle = {
      type: 'StrungRectangle',
      path: svg.path('M 1 2 L 50 60'),
      width: 40,
      height: 14,
      borderRadius: 3,
      rotation: -0.2,
      displacementFromCenter: 8,
      displacementFromCurve: { x: 12, y: 32 },
    };
    let p = {
      curve: {
        startPoint: { x: 1931.3996844210835, y: 1729.5108367252783 },
        controlPoint: { x: 1865.6776059731671, y: 1746.2976157074852 },
        endPoint: { x: 1818.334251163686, y: 1680.5146134521983 },
      },
      curveLength: 132.0704803466797,
    };
    repositionStrungElement(rectangle, p);
    let d = rectangle.path.attr('d');
    expect(d).toBe('M 1839.0199736324348 1678.4652487879382 A 3 3 90 0 1 1842.7508483480296 1676.4452057546005 L 1850.4187386799395 1678.7263146642765 A 3 3 90 0 1 1852.4387817132772 1682.4571893798714 L 1842.7440688471536 1715.045723290488 A 3 3 90 0 1 1839.0131941315587 1717.0657663238258 L 1831.345303799649 1714.7846574141497 A 3 3 90 0 1 1829.3252607663112 1711.0537826985549 Z');
  });

  test('a curve length of zero', () => {
    let text = {
      type: 'StrungText',
      text: svg.text('G'),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    let p = {
      curve: { startPoint: { x: 1, y: 2 }, endPoint: { x: 1, y: 2 } },
      curveLength: 0,
    };
    repositionStrungElement(text, p);
    expect(text.text.cx()).toBeCloseTo(1);
    expect(text.text.cy()).toBeCloseTo(2);
  });

  test('displacements from center that go beyond the curve start and end points', () => {
    let text = {
      type: 'StrungText',
      text: svg.text('B'),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    let p = {
      curve: { startPoint: { x: 1, y: 2 }, endPoint: { x: 4, y: 6 } },
      curveLength: 5,
    };

    // beyond the curve start point
    text.displacementFromCenter = -60;
    repositionStrungElement(text, p);
    expect(text.text.cx()).toBeCloseTo(1);
    expect(text.text.cy()).toBeCloseTo(2);

    // beyond the curve end point
    text.displacementFromCenter = 60;
    repositionStrungElement(text, p);
    expect(text.text.cx()).toBeCloseTo(4);
    expect(text.text.cy()).toBeCloseTo(6);
  });
});
