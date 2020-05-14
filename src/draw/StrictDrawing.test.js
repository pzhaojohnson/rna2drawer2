import StrictDrawing from './StrictDrawing';
import createNodeSVG from './createNodeSVG';
import parseDotBracket from '../parse/parseDotBracket';
import { radiateStems } from './layout/singleseq/strict/radiateStems';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import overallSecondaryPartners from './edit/overallSecondaryPartners';
import applyStrictLayout from './edit/applyStrictLayout';

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
  sd._appendSequence('asdf', 'asdf');
  expect(sd.svgString).toBe(sd._drawing.svgString);
});

it('zoom getter and setter', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd._appendSequence('qwer', 'qwer');
  sd.zoom = 2.75;
  expect(sd.zoom).toBeCloseTo(2.75);
  expect(sd._drawing.zoom).toBeCloseTo(2.75);
});

it('isEmpty method', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  expect(sd.isEmpty()).toBeTruthy();
  sd._appendSequence('asdf', 'asdf');
  expect(sd.isEmpty()).toBeFalsy();
});

describe('_pushUndo method', () => {
  it('pushes undo stack and clears redo stack', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdf');
    let savedState1 = sd.savableState();
    sd._pushUndo(savedState1);
    sd.undo();
    sd._appendSequence('zxcv', 'zxcv');
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
    sd._appendSequence('asdf', 'asdf');
    let savedState1 = sd.savableState();
    sd._undoStack.push(savedState1);
    sd._appendSequence('qwer', 'qwer');
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
    sd._appendSequence('asdf', 'asdf');
    let savedState1 = sd.savableState();
    sd._pushUndo(savedState1);
    sd._appendSequence('qwer', 'qwer');
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
    sd._appendSequence('asdf', 'asdf');
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
    sd._appendSequence('zxcv', 'zxcv');
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
    sd._appendSequence('asdf', 'asdf');
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
  sd._appendSequence('asdf', 'asdf');
  expect(sd.savableString).toBe(
    JSON.stringify(sd.savableState(), null, ' ')
  );
});

describe('_applySavedState method', () => {
  it('handles invalid saved state', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdf');
    let invalidState = sd.savableState();
    invalidState.baseWidth = 'asdf';
    sd._appendSequence('qwer', 'qwer');
    let prevState = sd.savableState();
    let prevJson = JSON.stringify(prevState);
    expect(sd._applySavedState(invalidState)).toBeFalsy();
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(prevJson);
  });

  it('applies a valid saved state', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdf');
    let savedState = sd.savableState();
    sd._appendSequence('qwer', 'qwer');
    expect(sd._applySavedState(savedState)).toBeTruthy();
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(JSON.stringify(savedState));
  });
});

describe('_appendSequence method', () => {
  it('sequence cannot be appended', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdf');
    expect(
      sd._appendSequence('asdf', 'asdfasdf')
    ).toBeFalsy();
    expect(sd._drawing.numSequences).toBe(1);
    expect(sd._perBaseLayoutProps.length).toBe(4);
  });

  it('sequence can be appended', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdf');
    expect(
      sd._appendSequence('qwer', 'qwerqwer')
    ).toBeTruthy();
    expect(sd._drawing.getSequenceById('qwer')).toBeTruthy();
    expect(sd._drawing.numBases).toBe(12);
    expect(sd._perBaseLayoutProps.length).toBe(12);
  });
});

describe('_appendStructure method', () => {
  it('does not allow knots in secondary structure', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    let appended = sd._appendStructure({
      id: 'asdf',
      characters: 'asdfasdf',
      secondaryPartners: [6, null, 8, null, null, 1, null, 3],
    });
    expect(appended).toBeFalsy();
    expect(sd._drawing.numSequences).toBe(0);
  });

  it('structure cannot be appended', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendStructure({
      id: 'asdf',
      characters: 'asdf',
    });
    let appended = sd._appendStructure({
      id: 'asdf',
      characters: 'qwer',
    });
    expect(appended).toBeFalsy();
    expect(sd._drawing.numSequences).toBe(1);
  });

  it('calls appendStructure function', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendStructure({
      id: 'qwer',
      characters: 'asdfqwer',
    });
    expect(sd._drawing.numSequences).toBe(1);
    let seq = sd._drawing.getSequenceById('qwer');
    expect(seq.characters).toBe('asdfqwer');
  });

  it('appends per base layout props', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendStructure({
      id: 'asdf',
      characters: 'asdf',
    });
    expect(sd._perBaseLayoutProps.length).toBe(4);
    sd._appendStructure({
      id: 'qwer',
      characters: 'qwerqwer',
    });
    expect(sd._perBaseLayoutProps.length).toBe(12);
  });

  it('handles undefined secondary partners', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendStructure({
      id: 'asdf',
      characters: 'asdf',
    });
    expect(sd._drawing.numSequences).toBe(1);
  });

  it('radiates stems', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('qwer', 'qwer');
    let dotBracket = '.((.))((.)).....';
    let parsed = parseDotBracket(dotBracket);
    let stretches3 = radiateStems(parsed.secondaryPartners);
    expect(stretches3[5]).toBeGreaterThan(0);
    sd._appendStructure({
      id: 'asdf',
      characters: dotBracket,
      secondaryPartners: parsed.secondaryPartners,
    });
    sd._perBaseLayoutProps.slice(4).forEach((ps, i) => {
      expect(ps.stretch3).toBe(stretches3[i]);
    });
  });

  it('updates layout', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('qwer', 'qwer');
    let seq = sd._drawing.getSequenceById('qwer');
    let yPrev = seq.getBaseAtPosition(4).yCenter;
    sd._appendStructure({
      id: 'asdf',
      characters: 'as',
    });
    expect(
      seq.getBaseAtPosition(4).yCenter
    ).not.toBeCloseTo(yPrev);
  });
});

describe('overallSecondaryPartners method', () => {
  it('returns same values as overallSecondaryPartners function', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdfasdf');
    let seq = sd._drawing.getSequenceById('asdf');
    sd._drawing.addSecondaryBond(
      seq.getBaseAtPosition(2),
      seq.getBaseAtPosition(6),
    );
    let partners = sd.overallSecondaryPartners();
    let expected = overallSecondaryPartners(sd._drawing);
    expected.forEach((v, i) => {
      expect(partners[i]).toBe(v);
    });
  });
});

describe('generalLayoutProps method', () => {
  it('returns a copy', () => {
    let sd = new StrictDrawing();
    let ps = sd.generalLayoutProps();
    expect(ps).not.toBe(sd._generalLayoutProps);
    expect(JSON.stringify(ps)).toBe(
      JSON.stringify(sd._generalLayoutProps)
    );
  });
});

describe('perBaseLayoutProps method', () => {
  it('returns copies', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequence('asdf', 'asdf');
    let arr = sd.perBaseLayoutProps();
    expect(arr).not.toBe(sd._perBaseLayoutProps);
    arr.forEach((ps, i) => {
      expect(ps).not.toBe(sd._perBaseLayoutProps[i]);
    });
    arr.forEach((ps, i) => {
      expect(JSON.stringify(ps)).toBe(
        JSON.stringify(sd._perBaseLayoutProps[i])
      );
    });
  });
});

it('baseWidth and baseHeight getters', () => {
  let sd = new StrictDrawing();
  sd._baseWidth = 9.664;
  sd._baseHeight = 14.783;
  expect(sd.baseWidth).toBe(9.664);
  expect(sd.baseHeight).toBe(14.783);
});

it('layout method', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  let parsed = parseDotBracket('((..))');
  sd._appendStructure({
    id: 'asdf',
    characters: 'asdfas',
    secondaryPartners: parsed.secondaryPartners,
    tertiaryPartners: parsed.tertiaryPartners,
  });
  let layout = sd.layout();
  let expected = new StrictLayout(
    parsed.secondaryPartners,
    sd.generalLayoutProps(),
    sd.perBaseLayoutProps(),
  );
  sd._drawing.forEachBase((b, p) => {
    let l = layout.baseCoordinatesAtPosition(p);
    let e = expected.baseCoordinatesAtPosition(p);
    expect(e.distanceBetweenCenters(l)).toBeCloseTo(0);
  });
});

it('_applyLayout method', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd._appendStructure({
    id: 'asdf',
    characters: 'asdfasdfa',
  });
  let seq = sd._drawing.getSequenceById('asdf');
  sd._drawing.addSecondaryBond(
    seq.getBaseAtPosition(2),
    seq.getBaseAtPosition(8),
  );
  sd._drawing.addSecondaryBond(
    seq.getBaseAtPosition(3),
    seq.getBaseAtPosition(7),
  );
  sd._applyLayout();
  let coordinates = [];
  sd._drawing.forEachBase(b => {
    coordinates.push({ xCenter: b.xCenter, yCenter: b.yCenter });
  });
  applyStrictLayout(sd._drawing, sd.layout(), sd.baseWidth, sd.baseHeight);
  sd._drawing.forEachBase((b, p) => {
    expect(b.xCenter).toBeCloseTo(coordinates[p - 1].xCenter);
    expect(b.yCenter).toBeCloseTo(coordinates[p - 1].yCenter);
  });
});
