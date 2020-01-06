import createNodeSVG from './createNodeSVG';

it('make SVG element', () => {
  let svg = createNodeSVG();
  let text = svg.text('blah');
});
