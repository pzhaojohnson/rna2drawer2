import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { prepareForExport } from 'Export/svg/prepareForExport';
import { toPptx } from 'Export/pptx/toPptx';
import { download } from 'Utilities/download';

export type Options = {
  name?: string; // name for the exported drawing
  scale?: number; // factor to scale the exported drawing by
  format?: 'svg' | 'pptx'; // format to export the drawing in
}

export function exportDrawing(drawing: Drawing, options?: Options) {

  // specify defaults
  let name = options?.name ?? 'Drawing';
  let format = options?.format ?? 'svg';

  // create an invisible container
  let container = document.createElement('div');
  container.style.cssText = 'max-width: 0px; max-height: 0px';
  document.body.appendChild(container);

  try {
    // create a copy of the SVG document of the drawing
    let copy = SVG.SVG();
    copy.addTo(container);
    copy.svg(drawing.svg.svg());
    let nested = copy.first();
    let content = nested.svg(false);
    copy.clear();
    copy.svg(content);

    prepareForExport(copy, {
      scale: options?.scale,
    });

    if (format == 'pptx') {
      let pptx = toPptx(copy);
      pptx.writeFile({ fileName: name + '.pptx' });
    } else {
      download({
        name: name + '.svg',
        type: 'text/plain',
        contents: copy.svg(),
      });
    }
  } catch (error) {
    console.error(error);
    console.error(`Unable to export drawing in ${format.toUpperCase()} format.`);
  } finally {
    // remove the invisible container (and the copy SVG document inside)
    container.remove();
  }
}
