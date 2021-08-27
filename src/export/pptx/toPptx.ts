import * as SVG from '@svgdotjs/svg.js';
import PptxGenJS from 'pptxgenjs';
import { pixelsToInches } from 'Export/units';
import { round } from 'Math/round';
import { addText } from './text';
import { addAsSvgImage } from './element';

export function toPptx(svg: SVG.Svg): PptxGenJS {
  let pres = new PptxGenJS();

  // set the dimensions of slides
  let width = pixelsToInches(svg.viewbox().width);
  let height = pixelsToInches(svg.viewbox().height);
  pres.defineLayout({
    name: 'CUSTOM_LAYOUT',
    width: round(width, 1),
    height: round(height, 1),
  });
  pres.layout = 'CUSTOM_LAYOUT';
  
  let slide = pres.addSlide();
  
  // add elements
  svg.children().forEach(child => {
    if (child instanceof SVG.Text) {
      addText(slide, child);
    } else if (child instanceof SVG.Line) {
      addAsSvgImage(slide, child);
    } else if (child instanceof SVG.Circle) {
      addAsSvgImage(slide, child);
    } else if (child instanceof SVG.Rect) {
      addAsSvgImage(slide, child);
    } else if (child instanceof SVG.Path) {
      addAsSvgImage(slide, child);
    } else {
      // can't just add any element as an SVG image since some elements
      // (e.g., defs) cause errors when adding them as SVG images
      if (child.type == 'defs') {
        console.log(`Intentionally omitting element of type: ${child.type}.`);
      } else {
        console.log(`Omitting element of unexpected type: ${child.type}.`);
      }
    }
  });
  
  return pres;
}
