import Drawing from './Drawing';
import createNodeSVG from './createNodeSVG';

it('instantiates', () => {
  expect(() => { new Drawing() }).not.toThrow();
});

it('Drawing addTo', () => {
  let drawing = new Drawing();
  expect(document.body.childNodes.length).toBe(0);
  drawing.addTo(document.body, () => createNodeSVG());
  expect(document.body.childNodes.length).toBe(1);
});

it('make SVG element', () => {
  let svg = createNodeSVG();
  let text = svg.text('blah');
});
