import * as SVG from '@svgdotjs/svg.js';
import { round } from 'Math/round';

function roundAttribute(ele: SVG.Element | SVG.Svg, name: string, places=6) {
  let v = ele.attr(name);
  if (typeof v == 'number') {
    ele.attr(name, round(v, places));
  }
}

function roundStrokeDasharray(ele: SVG.Element) {
  try {
    let rounded = '';
    (new SVG.Array(ele.attr('stroke-dasharray'))).forEach(v => {
      if (typeof v == 'number') {
        rounded += round(v, 6) + ' ';
      } else {
        rounded += v + ' ';
      }
    });
    ele.attr('stroke-dasharray', rounded);
  } catch {}
}

function roundTextNumbers(text: SVG.Text) {
  ['x', 'y', 'font-size'].forEach(name => {
    roundAttribute(text, name);
  });
}

function roundLineNumbers(line: SVG.Line) {
  ['x1', 'y1', 'x2', 'y2', 'stroke-width'].forEach(name => {
    roundAttribute(line, name);
  });
}

function roundCircleNumbers(circle: SVG.Circle) {
  ['cx', 'cy', 'r', 'stroke-width'].forEach(name => {
    roundAttribute(circle, name);
  });
}

function roundRectNumbers(rect: SVG.Rect) {
  ['x', 'y', 'width', 'height', 'stroke-width'].forEach(name => {
    roundAttribute(rect, name);
  });
}

function roundPathDescription(path: SVG.Path) {
  try {
    let rounded = '';
    (new SVG.PathArray(path.attr('d'))).forEach(command => {
      command.forEach((v: unknown) => {
        if (typeof v == 'number') {
          rounded += round(v, 6) + ' ';
        } else {
          rounded += v + ' ';
        }
      });
    });
    path.plot(rounded);
  } catch {}
}

function roundPathNumbers(path: SVG.Path) {
  ['stroke-width'].forEach(name => {
    roundAttribute(path, name);
  });
  roundStrokeDasharray(path);
  roundPathDescription(path);
}

function roundViewbox(svg: SVG.Svg) {
  let viewbox = svg.viewbox();
  svg.viewbox(
    round(viewbox.x, 6),
    round(viewbox.y, 6),
    round(viewbox.width, 6),
    round(viewbox.height, 6),
  );
}

export function roundNumbers(svg: SVG.Svg) {
  svg.children().forEach(child => {
    if (child instanceof SVG.Text) {
      roundTextNumbers(child);
    } else if (child instanceof SVG.Line) {
      roundLineNumbers(child);
    } else if (child instanceof SVG.Circle) {
      roundCircleNumbers(child);
    } else if (child instanceof SVG.Rect) {
      roundRectNumbers(child);
    } else if (child instanceof SVG.Path) {
      roundPathNumbers(child);
    }
  });
  ['width', 'height'].forEach(name => {
    roundAttribute(svg, name);
  });
  roundViewbox(svg);
}
