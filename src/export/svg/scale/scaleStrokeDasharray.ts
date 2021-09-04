import * as SVG from '@svgdotjs/svg.js';

export function scaleStrokeDasharray(ele: SVG.Element, factor: number) {
  try {
    let dasharray = ele.attr('stroke-dasharray');
    if (dasharray && dasharray != 'none') {
      let scaled = '';
      (new SVG.Array(dasharray)).forEach((v: unknown) => {
        let n = new SVG.Number(v as any);
        scaled += n.times(factor).convert('px').valueOf() + ' ';
      });
      ele.attr({ 'stroke-dasharray': scaled });
    }
  } catch (error) {
    console.error(error);
    console.error(`Unable to scale stroke-dasharray of element ${ele}.`);
  }
}
