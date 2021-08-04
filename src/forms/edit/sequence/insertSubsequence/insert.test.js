import App from '../../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { parseSubsequence, cannotInsert, insert } from './insert';
import { parseDotBracket } from '../../../../parse/parseDotBracket';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../../../draw/layout/singleseq/strict/PerBaseStrictLayoutProps';

let app = new App(() => NodeSVG());

let inputs = null;

beforeEach(() => {
  app.strictDrawing.drawing.clear();

  inputs = {
    insertPosition: 1,
    subsequence: 'asdf',
    ignoreNumbers: false,
    ignoreNonAugctLetters: false,
    ignoreNonAlphanumerics: false,
  };
});

it('parseSubsequence function', () => {
  inputs.subsequence = 'Acb1 \t\t \n3<> \\[] ER fga5 6aq';
  inputs.ignoreNumbers = false;
  inputs.ignoreNonAugctLetters = false;
  inputs.ignoreNonAlphanumerics = false;
  expect(parseSubsequence(inputs)).toBe('Acb13<>\\[]ERfga56aq');
  inputs.ignoreNumbers = true;
  expect(parseSubsequence(inputs)).toBe('Acb<>\\[]ERfgaaq');
  inputs.ignoreNumbers = false;
  inputs.ignoreNonAugctLetters = true;
  expect(parseSubsequence(inputs)).toBe('Ac13<>\\[]ga56a');
  inputs.ignoreNonAugctLetters = false;
  inputs.ignoreNonAlphanumerics = true;
  expect(parseSubsequence(inputs)).toBe('Acb13ERfga56aq');
});

describe('parseSubsequence function', () => {});

describe('cannotInsert function', () => {
  it('drawing has not sequences', () => {
    expect(app.strictDrawing.drawing.numSequences).toBe(0);
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy();
  });

  it('drawing has multiple sequences', () => {
    app.strictDrawing.appendSequence('asdf', 'asdf');
    app.strictDrawing.appendSequence('qwer', 'qwer');
    expect(app.strictDrawing.drawing.numSequences).toBe(2);
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy();
  });

  it('checks that insert position is in range', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    // takes into account numbering offset
    seq.numberingOffset = 38;
    inputs.insertPosition = 0 + 38; // just below range
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy();
    inputs.insertPosition = 1 + 38; // just in range
    expect(cannotInsert(app.strictDrawing, inputs)).toBeFalsy();
    inputs.insertPosition = seq.length + 1 + 38; // just in range
    expect(cannotInsert(app.strictDrawing, inputs)).toBeFalsy();
    inputs.insertPosition = seq.length + 2 + 38; // just above range
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy();
  });

  it('subsequence has only whitespace', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    inputs.subsequence = '  \t\t  \n \n';
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy();
    inputs.subsequence += 'asdf';
    expect(cannotInsert(app.strictDrawing, inputs)).toBeFalsy();
  });

  it('subsequence has only ignored characters', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    inputs.subsequence = ' 112  -- <>';
    inputs.ignoreNumbers = true;
    inputs.ignoreNonAlphanumerics = true;
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy();
    inputs.subsequence += 'asdf';
    expect(cannotInsert(app.strictDrawing, inputs)).toBeFalsy();
  });
});

describe('insert function', () => {
  it('does not insert when cannot', () => {
    // drawing has multiple sequences
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    app.strictDrawing.appendSequence('qwer', 'qwerqwer');
    // but could potentially insert in first sequence
    inputs.insertPosition = 2;
    inputs.subsequence = 'zxcv';
    expect(cannotInsert(app.strictDrawing, inputs)).toBeTruthy(); // should not insert
    let savableState = app.strictDrawing.savableState();
    insert(app.strictDrawing, inputs);
    // does not change drawing
    expect(app.strictDrawing.savableState()).toStrictEqual(savableState);
  });

  describe('when can insert', () => {
    let app = new App(() => NodeSVG());
    let strictDrawing = app.strictDrawing;
    let drawing = strictDrawing.drawing;
    let characters =    'abcdefghijklmnopqrstuvwx';
    let secondaryDtbr = '....((((((......))))))..';
    let tertiaryDtbr =  '.{..{{..}}.}..{{......}}';
    strictDrawing.appendStructure({
      id: 'asdf',
      characters: characters,
      secondaryPartners: parseDotBracket(secondaryDtbr).secondaryPartners,
      tertiaryPartners: parseDotBracket(tertiaryDtbr).tertiaryPartners,
    });
    let seq = drawing.getSequenceAtIndex(0);
    seq.numberingOffset = 91; // must take into account numbering offset

    let perBaseProps = strictDrawing.perBaseLayoutProps();

    // set stem props
    perBaseProps[4].flipStem = true;
    perBaseProps[4].loopShape = 'triangle';
    perBaseProps[4].triangleLoopHeight = 51.2;

    // stretch unpaired regions
    for (let p = 1; p <= 4; p++) {
      perBaseProps[p - 1].stretch3 = 2;
    }
    for (let p = 22; p <= 24; p++) {
      perBaseProps[p - 1].stretch3 = 5;
    }

    strictDrawing.setPerBaseLayoutProps(perBaseProps);

    let inputs = {
      insertPosition: 8 + 91, // inside a stem
      subsequence: 'AAQW',
      ignoreNumbers: true,
      ignoreNonAugctLetters: false,
      ignoreNonAlphanumerics: true,
    };
    insert(strictDrawing, inputs);

    inputs.insertPosition = 5 + 91; // just 5' to stem
    inputs.subsequence = 'RV';
    insert(strictDrawing, inputs);

    inputs.insertPosition = 29 + 91; // just 3' to stem
    inputs.subsequence = 'NMK';
    insert(strictDrawing, inputs);

    it('inserts bases', () => {
      expect(seq.characters).toBe('abcdRVefgAAQWhijklmnopqrstuvNMKwx')
    });

    it('breaks and repairs strand', () => {
      let pbs = [];
      drawing.primaryBonds.forEach(pb => pbs.push(pb));
      expect(pbs.length).toBe(seq.length - 1);
      // there is a primary bond between each consecutive pair of bases
      for (let p5 = 1; p5 < seq.length; p5++) {
        let b5 = seq.getBaseAtPosition(p5);
        let b3 = seq.getBaseAtPosition(p5 + 1);
        expect(pbs.find(pb => (
          pb.base1.id == b5.id && pb.base2.id == b3.id
        ))).toBeTruthy();
      }
    });

    it('adds new per base props', () => {
      let perBaseProps = strictDrawing.perBaseLayoutProps();
      expect(perBaseProps.length).toBe(seq.length);
    });

    it('transfers stem props', () => {
      let perBaseProps = strictDrawing.perBaseLayoutProps();
      let defaults = new PerBaseProps();
      expect(perBaseProps[6].flipStem).toBeTruthy();
      expect(perBaseProps[6].loopShape).toBe(defaults.loopShape);
      expect(perBaseProps[6].triangleLoopHeight).toBe(defaults.triangleLoopHeight);
      expect(perBaseProps[13].flipStem).toBeFalsy();
      expect(perBaseProps[13].loopShape).toBe('triangle');
      expect(perBaseProps[13].loopShape).not.toBe(defaults.loopShape);
      expect(perBaseProps[13].triangleLoopHeight).toBe(51.2);
      expect(perBaseProps[13].triangleLoopHeight).not.toBe(defaults.triangleLoopHeight);
    });

    it('evens out stretches', () => {
      let perBaseProps = strictDrawing.perBaseLayoutProps();
      for (let p = 1; p <= 6; p++) {
        expect(perBaseProps[p - 1].stretch3).toBeCloseTo(8 / 6);
      }
      for (let p = 28; p <= seq.length; p++) {
        expect(perBaseProps[p - 1].stretch3).toBeCloseTo(15 / 6);
      }
    });
  });
});
