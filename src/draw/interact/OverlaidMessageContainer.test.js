import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as SVG from '@svgdotjs/svg.js';

import { OverlaidMessageContainer } from './OverlaidMessageContainer';

let drawingContainer = null;
let drawing = null;

beforeEach(() => {
  drawingContainer = document.createElement('div');
  document.body.appendChild(drawingContainer);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(drawingContainer);
});

afterEach(() => {
  drawing = null;

  drawingContainer.remove();
  drawingContainer = null;
});

describe('OverlaidMessageContainer element', () => {
  it('ignores pointer events by default', () => {
    let messageContainer = new OverlaidMessageContainer();
    expect(messageContainer.node.style.pointerEvents).toBe('none');
  });

  test('placeOver and remove methods', () => {
    let messageContainer = new OverlaidMessageContainer();

    // should reassign
    messageContainer.node.style.position = 'relative';
    messageContainer.node.style.zIndex = '-1';

    messageContainer.placeOver(drawing);

    // reassigned
    expect(messageContainer.node.style.position).toBe('fixed');
    expect(messageContainer.node.style.zIndex).toBe('1');

    // added to document and inside the drawing
    expect(drawing.svgContainer.contains(messageContainer.node)).toBeTruthy();

    // should be offset from the bottom left corner
    let bottom = new SVG.Number(messageContainer.node.style.bottom);
    let left = new SVG.Number(messageContainer.node.style.left);
    expect(bottom.valueOf()).toBeGreaterThan(0);
    expect(left.valueOf()).toBeGreaterThan(0);

    messageContainer.remove();

    // removed entirely from document
    expect(messageContainer.node.parent).toBeFalsy();
  });

  test('append method', () => {
    let p = document.createElement('p');
    p.textContent = 'Asdf.';

    let div = document.createElement('div');
    ReactDOM.render(<p>Qwer.</p>, div);

    let messageContainer = new OverlaidMessageContainer();
    expect(messageContainer.node.contains(p)).toBeFalsy();
    expect(messageContainer.node.contains(div)).toBeFalsy();
    expect(messageContainer.node.textContent).toBe('');

    messageContainer.append(p);
    messageContainer.append(div);
    expect(messageContainer.node.childNodes[0]).toBe(p);
    expect(messageContainer.node.childNodes[1]).toBe(div);
    expect(messageContainer.node.textContent).toBe('Asdf.Qwer.');
  });

  test('style getter', () => {
    let messageContainer = new OverlaidMessageContainer();
    expect(messageContainer.style).toBe(messageContainer.node.style);
  });
});
