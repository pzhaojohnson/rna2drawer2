import App from '../../../../App';
import NodeSVG from '../../../../draw/NodeSVG';
import { cannotRemove, remove } from './remove';
import { parseDotBracket } from '../../../../parse/parseDotBracket';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../../../draw/layout/singleseq/strict/PerBaseStrictLayoutProps';

let app = new App(() => NodeSVG());

beforeEach(() => {
  app.strictDrawing.drawing.clear();
});

describe('cannotRemove function', () => {
  it('drawing has no sequences', () => {
    expect(app.strictDrawing.drawing.numSequences).toBe(0);
    expect(cannotRemove(app.strictDrawing, { start: 1, end: 2 })).toBeTruthy();
  });

  it('drawing has multiple sequences', () => {
    app.strictDrawing.appendSequence('asdf', 'asdf');
    app.strictDrawing.appendSequence('qwer', 'qwer');
    expect(app.strictDrawing.drawing.numSequences).toBe(2);
    expect(cannotRemove(app.strictDrawing, { start: 1, end: 2 })).toBeTruthy();
  });

  it('start is less than, equal to and greater than end', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdfasdf');
    expect(cannotRemove(app.strictDrawing, { start: 3, end: 4 })).toBeFalsy(); // less than
    expect(cannotRemove(app.strictDrawing, { start: 3, end: 3 })).toBeFalsy(); // equal to
    expect(cannotRemove(app.strictDrawing, { start: 6, end: 5 })).toBeTruthy(); // greater than
  });

  it('start or end are out of range', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdfasdf');
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    seq.numberingOffset = 10; // must take into account numbering offset
    expect(cannotRemove(app.strictDrawing, { start: 20, end: 21 })).toBeFalsy(); // in range
    expect(cannotRemove(app.strictDrawing, { start: 10, end: 12 })).toBeTruthy(); // start is out of range
    expect(cannotRemove(app.strictDrawing, { start: 15, end: 23 })).toBeTruthy(); // end is out of range
  });

  it('start and end cover entire sequence', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdfasdf');
    let seq = app.strictDrawing.drawing.getSequenceAtIndex(0);
    expect(cannotRemove(app.strictDrawing, { start: 1, end: seq.length })).toBeTruthy();
  });
});

describe('remove function', () => {
  it('does nothing when cannot remove', () => {
    let app = new App(() => NodeSVG());
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    let r = { start: 5, end: 10 };
    expect(cannotRemove(app.strictDrawing, r)).toBeTruthy(); // end is out of range
    expect(r.start).toBeLessThan(app.strictDrawing.drawing.numBases); // but some bases are in range
    let state = app.strictDrawing.savableState();
    remove(app.strictDrawing, r);
    expect(app.strictDrawing.savableState()).toStrictEqual(state); // did not change drawing
  });

  describe('when can remove', () => {
    let app = new App(() => NodeSVG());
    let strictDrawing = app.strictDrawing;
    let drawing = strictDrawing.drawing;
    let characters =    'abcdefghijklmnopqrstuvwxyzABCDEF';
    let secondaryDtbr = '..((((((((....))))))))..((..))..';
    let tertiaryDtbr =  '.{...{{{{......}}}}...}...{..}..';
    strictDrawing.appendStructure({
      id: 'asdf',
      characters: characters,
      secondaryPartners: parseDotBracket(secondaryDtbr).secondaryPartners,
      tertiaryPartners: parseDotBracket(tertiaryDtbr).tertiaryPartners,
    });
    let seq = drawing.getSequenceAtIndex(0);
    seq.numberingOffset = 1012; // must take into account numbering offset

    let perBaseProps = strictDrawing.perBaseLayoutProps();

    // set stem props
    perBaseProps[2].flipStem = true;
    perBaseProps[2].loopShape = 'triangle';
    perBaseProps[2].triangleLoopHeight = 123.456;

    // set stretches
    for (let p = 22; p <= seq.length; p++) {
      perBaseProps[p - 1].stretch3 = 0;
    }
    for (let p = 30; p <= seq.length; p++) {
      perBaseProps[p - 1].stretch3 = 3;
    }

    strictDrawing.setPerBaseLayoutProps(perBaseProps);

    let r = { start: 5 + seq.numberingOffset, end: 8 + seq.numberingOffset };
    remove(strictDrawing, r);

    r = { start: 21 + seq.numberingOffset, end: 22 + seq.numberingOffset };
    remove(strictDrawing, r);

    it('transfers stem props', () => {
      let perBaseProps = strictDrawing.perBaseLayoutProps();
      let defaults = new PerBaseProps();
      expect(perBaseProps[2].loopShape).toBe(defaults.loopShape);
      expect(perBaseProps[4].loopShape).toBe('triangle');
      expect(perBaseProps[2].triangleLoopHeight).toBe(defaults.triangleLoopHeight);
      expect(perBaseProps[4].triangleLoopHeight).toBe(123.456);
      // keeps outer stem flipped
      expect(perBaseProps[2].flipStem).toBeTruthy();
      expect(perBaseProps[4].flipStem).toBeFalsy();
    });

    it('removes per base props of removed bases', () => {
      // checking that stem props were transferred and that
      // the stretches of unpaired regions were evened out
      // checks that the right per base props were removed
      let perBaseProps = strictDrawing.perBaseLayoutProps();
      expect(perBaseProps.length).toBe(26);
    });

    it('removes primary bonds with removed bases and repairs strand break', () => {
      let pbs = [];
      drawing.primaryBonds.forEach(pb => pbs.push(pb));
      expect(drawing.primaryBonds.length).toBe(seq.length - 1);
      // each consecutive pair of bases has a primary bond
      for (let p5 = 1; p5 < seq.length; p5++) {
        let b5 = seq.getBaseAtPosition(p5);
        let b3 = seq.getBaseAtPosition(p5 + 1);
        expect(pbs.find(pb => (
          pb.base1.id == b5.id && pb.base2.id == b3.id
        ))).toBeTruthy();
      }
    });

    it('removes secondary bonds with removed bases', () => {
      // all secondary bonds are between bases that still exist
      let baseIds = drawing.baseIds();
      drawing.secondaryBonds.forEach(sb => {
        expect(baseIds.includes(sb.base1.id)).toBeTruthy();
        expect(baseIds.includes(sb.base2.id)).toBeTruthy();
      });
      // only secondary bonds with removed bases were removed
      expect(drawing.secondaryBonds.length).toBe(4);
    });

    it('removes tertiary bond with removed bases', () => {
      // all tertiary bonds are between bases that still exist
      let baseIds = drawing.baseIds();
      drawing.tertiaryBonds.forEach(tb => {
        expect(baseIds.includes(tb.base1.id)).toBeTruthy();
        expect(baseIds.includes(tb.base2.id)).toBeTruthy();
      });
      // only tertiary bonds with removed bases were removed
      expect(drawing.tertiaryBonds.length).toBe(3);
    });

    it('removes correct bases', () => {
      expect(seq.characters).toBe('abcdijklmnopqrstuvwxABCDEF');
    });

    it('evens out stretches of unpaired regions', () => {
      let perBaseProps = strictDrawing.perBaseLayoutProps();
      for (let p = 18; p <= seq.length; p++) {
        expect(perBaseProps[p - 1].stretch3).toBeCloseTo(1);
      }
    });
  });
});
