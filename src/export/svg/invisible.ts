import * as SVG from '@svgdotjs/svg.js';

export function removeInvisibleLines(svg: SVG.Svg) {
  let invisibles: SVG.Line[] = [];
  svg.children().forEach(child => {
    if (child instanceof SVG.Line) {
      let isInvisible = (
        child.attr('opacity') == 0
        || child.attr('stroke-opacity') == 0
      );
      if (isInvisible) {
        invisibles.push(child);
      }
    }
  });
  invisibles.forEach(child => child.remove());
}
