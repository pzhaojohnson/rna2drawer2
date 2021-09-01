import * as SVG from '@svgdotjs/svg.js';

// some applications (e.g., Adobe Illustrator) don't seem to support
// the dominant-baseline attribute
export function resetTextDominantBaselines(svg: SVG.Svg) {
  svg.children().forEach(child => {
    if (child instanceof SVG.Text) {
      let v = child.attr('dominant-baseline');
      if (v !== undefined && v != 'auto') {
        let bbox = child.bbox();
        let center = { x: bbox.cx, y: bbox.cy };
        child.attr({ 'dominant-baseline': 'auto' });
        child.center(center.x, center.y);
      }
    }
  });
}
