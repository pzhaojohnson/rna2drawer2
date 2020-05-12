import StrictDrawing from './StrictDrawing';
import createNodeSVG from './createNodeSVG';

it('instantiates', () => {
  expect(() => new StrictDrawing()).not.toThrow();
});

describe('addTo method', () => {
  it('calls addTo method of drawing', () => {
    let sd = new StrictDrawing();
    let n = document.body.childNodes.length;
    sd.addTo(document.body, () => createNodeSVG());
    expect(document.body.childNodes.length).toBe(n + 1);
  });
});

it('svgString getter', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd._appendSequenceOutOfView('asdf', 'asdf');
  expect(sd.svgString).toBe(sd._drawing.svgString);
});

it('zoom getter and setter', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd._appendSequenceOutOfView('qwer', 'qwer');
  sd._updateLayout();
  sd.zoom = 2.75;
  expect(sd.zoom).toBeCloseTo(2.75);
  expect(sd._drawing.zoom).toBeCloseTo(2.75);
});

it('isEmpty method', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  expect(sd.isEmpty()).toBeTruthy();
  sd._appendSequenceOutOfView('asdf', 'asdf');
  expect(sd.isEmpty()).toBeFalsy();
});

describe('_pushUndo method', () => {
  it('pushes undo stack and clears redo stack', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let savedState1 = sd.savableState();
    sd._pushUndo(savedState1);
    sd.undo();
    sd._appendSequenceOutOfView('zxcv', 'zxcv');
    let savedState2 = sd.savableState();
    expect(sd._undoStack.isEmpty()).toBeTruthy();
    expect(sd._redoStack.isEmpty()).toBeFalsy();
    sd._pushUndo(savedState2);
    expect(
      JSON.stringify(sd._undoStack.peek())
    ).toBe(JSON.stringify(savedState2));
    expect(sd._redoStack.isEmpty()).toBeTruthy();
  });
});

describe('undo method', () => {
  it('handles empty undo stack', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    expect(sd._undoStack.isEmpty()).toBeTruthy();
    expect(() => sd.undo()).not.toThrow();
  });

  it('pops undo stack, applies saved state and pushes redo stack', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let savedState1 = sd.savableState();
    sd._undoStack.push(savedState1);
    sd._appendSequenceOutOfView('qwer', 'qwer');
    let savedState2 = sd.savableState();
    sd.undo();
    expect(sd._undoStack.isEmpty()).toBeTruthy();
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(JSON.stringify(savedState1));
    expect(
      JSON.stringify(sd._redoStack.peek())
    ).toBe(JSON.stringify(savedState2));
  });
});

describe('redo method', () => {
  it('handles empty redo stack', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    expect(sd._redoStack.isEmpty()).toBeTruthy();
    expect(() => sd.redo()).not.toThrow();
  });

  it('pops redo stack, applies saved state and pushes undo stack', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let savedState1 = sd.savableState();
    sd._pushUndo(savedState1);
    sd._appendSequenceOutOfView('qwer', 'qwer');
    let savedState2 = sd.savableState();
    sd.undo();
    sd.redo();
    expect(
      JSON.stringify(sd._undoStack.peek())
    ).toBe(JSON.stringify(savedState1));
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(JSON.stringify(savedState2));
    expect(sd._redoStack.isEmpty()).toBeTruthy();
  });
});

describe('savableState method', () => {
  it('includes drawing', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let savableState = sd.savableState();
    expect(
      JSON.stringify(savableState.drawing)
    ).toBe(
      JSON.stringify(sd._drawing.savableState())
    );
  });

  it('includes layout props', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('zxcv', 'zxcv');
    let savableState = sd.savableState();
    expect(
      JSON.stringify(savableState.generalLayoutProps)
    ).toBe(
      JSON.stringify(sd._generalLayoutProps.savableState())
    );
    savableState.perBaseLayoutProps.forEach((ps, i) => {
      expect(JSON.stringify(ps)).toBe(
        JSON.stringify(sd._perBaseLayoutProps[i].savableState())
      );
    });
  });

  it('includes base width and height', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._baseWidth = 18.777;
    sd._baseHeight = 21.356;
    let savableState = sd.savableState();
    expect(savableState.baseWidth).toBe(18.777);
    expect(savableState.baseHeight).toBe(21.356);
  });

  it('can be converted to and from a JSON string', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let savableState1 = sd.savableState();
    let json1 = JSON.stringify(savableState1);
    let savableState2 = JSON.parse(json1);
    let json2 = JSON.stringify(savableState2);
    expect(json2).toBe(json1);
  });
});

it('savableString getter', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd._appendSequenceOutOfView('asdf', 'asdf');
  expect(sd.savableString).toBe(
    JSON.stringify(sd.savableState())
  );
});
