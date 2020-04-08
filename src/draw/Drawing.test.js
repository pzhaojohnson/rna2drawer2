import Drawing from './Drawing';
import createNodeSVG from './createNodeSVG';

it('render', () => {
  new Drawing(() => createNodeSVG());
});

it('make SVG element', () => {
  let svg = createNodeSVG();
  let text = svg.text('blah');
});
