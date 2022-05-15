import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';

import { App } from './App';

describe('App class', () => {
  test('appendTo and remove methods', () => {
    let app = new App({ SVG });
    let container = document.createElement('div');
    let siblings = [document.createElement('div'), document.createElement('div')];
    siblings.forEach(sibling => container.appendChild(sibling));
    expect(container.contains(app.node)).toBeFalsy();
    app.appendTo(container);
    expect(container.lastChild).toBe(app.node); // appended to end
    app.remove();
    expect(container.contains(app.node)).toBeFalsy(); // was removed
  });

  it('updateDocumentTitle method', () => {
    let app = new App({ SVG });
    // make sure title is not already RNA2Drawer
    document.title = 'asdf';
    expect(app.drawing.isEmpty()).toBeTruthy();
    app.updateDocumentTitle();
    expect(document.title).toBe('RNA2Drawer');
    appendSequence(app.strictDrawing.drawing, { id: '1123nm', characters: 'asdfQWER' });
    app.updateDocumentTitle();
    expect(document.title).toBe('1123nm');
  });
});
