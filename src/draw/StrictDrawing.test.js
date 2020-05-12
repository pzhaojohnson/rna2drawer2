import StrictDrawing from './StrictDrawing';
import createNodeSVG from './createNodeSVG';
import parseDotBracket from '../parse/parseDotBracket';
import { radiateStems } from './layout/singleseq/strict/radiateStems';

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

describe('_applySavedState method', () => {
  it('handles invalid saved state', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let invalidState = sd.savableState();
    invalidState.baseWidth = 'asdf';
    sd._appendSequenceOutOfView('qwer', 'qwer');
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
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let savedState = sd.savableState();
    sd._appendSequenceOutOfView('qwer', 'qwer');
    expect(sd._applySavedState(savedState)).toBeTruthy();
    expect(
      JSON.stringify(sd.savableState())
    ).toBe(JSON.stringify(savedState));
  });
});

describe('_appendSequenceOutOfView method', () => {
  it('sequence cannot be appended', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    expect(
      sd._appendSequenceOutOfView('asdf', 'asdfasdf')
    ).toBeFalsy();
    expect(sd._drawing.numSequences).toBe(1);
    expect(sd._perBaseLayoutProps.length).toBe(4);
  });

  it('sequence can be appended', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    expect(
      sd._appendSequenceOutOfView('qwer', 'qwerqwer')
    ).toBeTruthy();
    expect(sd._drawing.getSequenceById('qwer')).toBeTruthy();
    expect(sd._drawing.numBases).toBe(12);
    expect(sd._perBaseLayoutProps.length).toBe(12);
  });
});

describe('_appendStructure method', () => {
  it('sequence cannot be appended', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('asdf', 'asdf');
    let appended = sd._appendStructure({
      id: 'asdf',
      characters: 'asd',
      secondaryPartners: [3, null, 1],
      tertiaryPartners: [3, null, 1],
    });
    expect(appended).toBeFalsy();
    expect(sd._drawing.numBases).toBe(4);
    expect(sd._perBaseLayoutProps.length).toBe(4);
    expect(sd._drawing.numPrimaryBonds).toBe(0);
    expect(sd._drawing.numSecondaryBonds).toBe(0);
    expect(sd._drawing.numTertiaryBonds).toBe(0);
  });

  it('appends sequence, per base layout props and primary bonds', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    let appended = sd._appendStructure({
      id: 'asdf',
      characters: 'asd',
      secondaryPartners: [null, null, null],
      tertiaryPartners: [null, null, null],
    });
    expect(appended).toBeTruthy();
    let seq = sd._drawing.getSequenceById('asdf');
    expect(seq.length).toBe(3);
    expect(sd._perBaseLayoutProps.length).toBe(3);
    expect(sd._drawing.numPrimaryBonds).toBe(2);
    let p = 1;
    sd._drawing.forEachPrimaryBond(pb => {
      expect(pb.base1.id).toBe(seq.getBaseAtPosition(p).id);
      expect(pb.base2.id).toBe(seq.getBaseAtPosition(p + 1).id);
      p++;
    });
  });

  it('adds secondary and tertiary bonds', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    let appended = sd._appendStructure({
      id: 'asdf',
      characters: 'asdfqw',
      secondaryPartners: [null, 5, null, null, 2, null],
      tertiaryPartners: [null, null, 6, null, null, 3],
    });
    expect(appended).toBeTruthy();
    let seq = sd._drawing.getSequenceById('asdf');
    expect(sd._drawing.numSecondaryBonds).toBe(1);
    sd._drawing.forEachSecondaryBond(sb => {
      expect(sb.base1.id).toBe(seq.getBaseAtPosition(2).id);
      expect(sb.base2.id).toBe(seq.getBaseAtPosition(5).id);
    });
    expect(sd._drawing.numTertiaryBonds).toBe(1);
    sd._drawing.forEachTertiaryBond(tb => {
      expect(tb.base1.id).toBe(seq.getBaseAtPosition(3).id);
      expect(tb.base2.id).toBe(seq.getBaseAtPosition(6).id);
    });
  });

  it('radiates stems', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('qwer', 'qwer');
    let dotBracket = '.((.))((.)).....';
    let parsed = parseDotBracket(dotBracket);
    let stretches3 = radiateStems(parsed.secondaryPartners);
    expect(stretches3[5]).toBeGreaterThan(0);
    sd._appendStructure({
      id: 'asdf',
      characters: dotBracket,
      secondaryPartners: parsed.secondaryPartners,
      tertiaryPartners: parsed.tertiaryPartners,
    });
    sd._perBaseLayoutProps.slice(4).forEach((ps, i) => {
      expect(ps.stretch3).toBe(stretches3[i]);
    });
  });

  it('updates layout', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => createNodeSVG());
    sd._appendSequenceOutOfView('qwer', 'qwer');
    let seq = sd._drawing.getSequenceById('qwer');
    let yPrev = seq.getBaseAtPosition(4).yCenter;
    sd._appendStructure({
      id: 'asdf',
      characters: 'as',
      secondaryPartners: [null, null],
      tertiaryPartners: [null, null],
    });
    expect(
      seq.getBaseAtPosition(4).yCenter
    ).not.toBeCloseTo(yPrev);
  });
});
