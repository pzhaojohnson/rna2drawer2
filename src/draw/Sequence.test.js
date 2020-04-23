import Sequence from './Sequence';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import Base from './Base';
import normalizeAngle from './normalizeAngle';

describe('Sequence class', () => {
  it('mostRecentProps static method', () => {
    Sequence._mostRecentProps.numberingAnchor = -2;
    Sequence._mostRecentProps.numberingIncrement = 6;
    
    let props = Sequence.mostRecentProps();
    expect(props).not.toBe(Sequence._mostRecentProps);
    expect(props.numberingAnchor).toBe(-2);
    expect(props.numberingIncrement).toBe(6);
  });

  it('_applyMostRecentProps static method', () => {
    let svg = createNodeSVG();

    Sequence._mostRecentProps.numberingAnchor = 2;
    Sequence._mostRecentProps.numberingIncrement = 3;
    
    // to empty sequence
    let seq1 = new Sequence(createUUIDforSVG());
    Sequence._applyMostRecentProps(seq1, svg);
    expect(seq1.numberingAnchor).toBe(2);
    expect(seq1.numberingIncrement).toBe(3);

    // to nonempty sequence that will result in changes to base numberings
    let seq2 = new Sequence(createUUIDforSVG());
    seq2.appendBase(Base.create(svg, 'a', 1, 2));
    seq2.appendBase(Base.create(svg, 'v', 3, 2));
    Sequence._applyMostRecentProps(seq2, svg);
    expect(seq2.numberingAnchor).toBe(2);
    expect(seq2.numberingIncrement).toBe(3);
  });

  it('_copyPropsToMostRecent static method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    seq.setNumberingAnchor(-5, svg);
    seq.setNumberingIncrement(4, svg);

    Sequence._copyPropsToMostRecent(seq);
    let props = Sequence.mostRecentProps();
    expect(props.numberingAnchor).toBe(-5);
    expect(props.numberingIncrement).toBe(4);
  });

  it('_clockwiseNormalAngleOfBase static method', () => {
    let cna = Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 1, yCenter: 2 },
      null,
      null,
    );
    
    expect(normalizeAngle(cna, 0)).toBeCloseTo(Math.PI / 2, 6);

    cna = Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 2.5, yCenter: -1.0 },
      null,
      { xCenter: 5, yCenter: 3 },
    );
    
    expect(normalizeAngle(cna, 0)).toBeCloseTo(2.5829933382462307, 6);

    cna = Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 0, yCenter: -9.2 },
      { xCenter: 3.1, yCenter: 0 },
      null,
    );
    
    expect(normalizeAngle(cna, 0)).toBeCloseTo(5.958177435312939, 6);

    // does not require normalizing the 5' angle to the 3' angle
    cna = Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 1, yCenter: 2 },
      { xCenter: 0.8, yCenter: 3.3 },
      { xCenter: 2.02, yCenter: 1.7 },
    );

    expect(normalizeAngle(cna, 0)).toBeCloseTo(0.7186971067364218, 6);

    // requires normalizing the 5' angle to the 3' angle
    cna = Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 1, yCenter: 2 },
      { xCenter: 1.25, yCenter: -0.5 },
      { xCenter: 2.02, yCenter: 2.3 },
    );

    expect(normalizeAngle(cna, 0)).toBeCloseTo(2.549054537296585, 6);
  });

  it('_clockwiseNormalAngleAtPositionFromSavedState static method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // no 5' or 3' bases
    let b1 = Base.create(svg, 'g', 4, 5);
    seq.appendBase(b1, svg);
    let savedState = seq.savableState();

    expect(
      Sequence._clockwiseNormalAngleAtPositionFromSavedState(1, savedState, svg)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
        null,
      ),
      6,
    );
    
    // only a 3' base
    let b2 = Base.create(svg, 'e', -1, 0);
    seq.appendBase(b2, svg);
    savedState = seq.savableState();

    expect(
      Sequence._clockwiseNormalAngleAtPositionFromSavedState(1, savedState, svg)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
      ),
      6,
    );

    // only a 5' base
    expect(
      Sequence._clockwiseNormalAngleAtPositionFromSavedState(2, savedState, svg)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
      ),
      6,
    );

    // both a 5' and 3' base
    let b3 = Base.create(svg, 'r', 5, 5);
    seq.appendBase(b3, svg);
    savedState = seq.savableState();

    expect(
      Sequence._clockwiseNormalAngleAtPositionFromSavedState(2, savedState, svg)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        { xCenter: b3.xCenter, yCenter: b3.yCenter },
      ),
      6,
    );
  });

  it('_innerNormalAngleOfBase static method', () => {
    expect(Sequence._innerNormalAngleOfBase(
      { xCenter: 2.2, yCenter: 3.3 },
      null,
      null,
    )).toBeCloseTo(Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 2.2, yCenter: 3.3 },
      null,
      null,
    ), 6);

    expect(Sequence._innerNormalAngleOfBase(
      { xCenter: 2.5, yCenter: 0 },
      null,
      { xCenter: -1.3, yCenter: -1.3 },
    )).toBeCloseTo(Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 2.5, yCenter: 0 },
      null,
      { xCenter: -1.3, yCenter: -1.3 },
    ), 6);

    expect(Sequence._innerNormalAngleOfBase(
      { xCenter: 1.1, yCenter: -1.1 },
      { xCenter: 0, yCenter: 0.001 },
      null,
    )).toBeCloseTo(Sequence._clockwiseNormalAngleOfBase(
      { xCenter: 1.1, yCenter: -1.1 },
      { xCenter: 0, yCenter: 0.001 },
      null,
    ), 6);

    // difference between 5' and 3' angles is less than Math.PI
    let ina = Sequence._innerNormalAngleOfBase(
      { xCenter: 0, yCenter: 0 },
      { xCenter: 0.8, yCenter: 1.2 },
      { xCenter: -0.9, yCenter: 1.2 },
    );

    expect(normalizeAngle(ina, 0)).toBeCloseTo(1.598545579417755, 6);

    // difference between 5' and 3' angles is greater than Math.PI
    ina = Sequence._innerNormalAngleOfBase(
      { xCenter: 1.5, yCenter: 0.5 },
      { xCenter: 2.2, yCenter: 0.3 },
      { xCenter: 1.8, yCenter: 0.3 },
    );

    expect(normalizeAngle(ina, 0)).toBeCloseTo(5.850034175903247, 6);

    // requires normalizing the 5' angle to the 3' angle
    ina = Sequence._innerNormalAngleOfBase(
      { xCenter: 1, yCenter: 2 },
      { xCenter: 1.205, yCenter: -0.67 },
      { xCenter: 2.32, yCenter: 2.29 },
    );

    expect(normalizeAngle(ina, 0)).toBeCloseTo(5.644232109890168, 6);
  });

  describe('fromSavedState static method', () => {
    it('an empty sequence', () => {
      let svg = createNodeSVG();
      let seq1 = new Sequence(createUUIDforSVG());
      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.length).toBe(0);
    });

    it('a sequence of length one', () => {
      let svg = createNodeSVG();
      let seq1 = new Sequence(createUUIDforSVG());
      
      let b1 = Base.create(svg, 't', 4, 5);
      seq1.appendBase(b1, svg);
      
      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.length).toBe(1);

      expect(
        JSON.stringify(seq2.getBaseAtPosition(1).savableState())
      ).toBe(
        JSON.stringify(b1.savableState())
      );
    });

    it('a sequence of length greater than one', () => {
      let svg = createNodeSVG();
      let seq1 = new Sequence(createUUIDforSVG());
      
      let b1 = Base.create(svg, 't', 4, 5);
      seq1.appendBase(b1, svg);
      let b2 = Base.create(svg, 'r', 3, 4);
      seq1.appendBase(b2, svg);
      let b3 = Base.create(svg, 'q', 5, 6);
      seq1.appendBase(b3, svg);
      
      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.length).toBe(3);

      expect(
        JSON.stringify(seq2.getBaseAtPosition(1).savableState())
      ).toBe(
        JSON.stringify(b1.savableState())
      );
      
      expect(
        JSON.stringify(seq2.getBaseAtPosition(2).savableState())
      ).toBe(
        JSON.stringify(b2.savableState())
      );

      expect(
        JSON.stringify(seq2.getBaseAtPosition(3).savableState())
      ).toBe(
        JSON.stringify(b3.savableState())
      );
    });

    it('passes clockwise normal angle to bases', () => {
      
      // check by including a base with a circle annotation
      let svg = createNodeSVG();
      let seq1 = new Sequence(createUUIDforSVG());
      let b1 = Base.create(svg, 'g', 4, 5);
      let ca1 = b1.addCircleAnnotation(svg);
      seq1.appendBase(b1, svg);

      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.length).toBe(1);
      let b2 = seq2.getBaseAtPosition(1);
      expect(b1._text.id()).toBe(b2._text.id());
      expect(b2.numAnnotations).toBe(1);
      expect(b2.getAnnotationById(ca1.id)).not.toBe(null);
    });

    it('sets numbering properties', () => {
      let svg = createNodeSVG();
      let seq1 = new Sequence(createUUIDforSVG());
      seq1.setNumberingOffset(4, svg);
      seq1.setNumberingAnchor(-2, svg);
      seq1.setNumberingIncrement(3, svg);

      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.numberingOffset).toBe(4);
      expect(seq2.numberingAnchor).toBe(-2);
      expect(seq2.numberingIncrement).toBe(3);
    });

    it('updates most recent properties', () => {
      let svg = createNodeSVG();
      let seq1 = new Sequence(createUUIDforSVG());
      seq1.setNumberingAnchor(3, svg);
      seq1.setNumberingIncrement(8, svg);

      Sequence._mostRecentProps.numberingAnchor = 0;
      Sequence._mostRecentProps.numberingIncrement = 0;

      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      let mrps = Sequence.mostRecentProps();
      expect(mrps.numberingAnchor).toBe(3);
      expect(mrps.numberingIncrement).toBe(8);
    });
  });

  it('createOutOfView static method', () => {
    let svg = createNodeSVG();

    // empty sequence
    let seq = Sequence.createOutOfView(svg, createUUIDforSVG(), '');
    expect(seq.length).toBe(0);

    function baseIsOutOfView(b) {
      return b.xCenter <= -50 || b.yCenter <= -50;
    }

    // one character
    seq = Sequence.createOutOfView(svg, createUUIDforSVG(), 'o');
    expect(seq.length).toBe(1);
    let b1 = seq.getBaseAtPosition(1);
    expect(b1.character).toBe('o');
    expect(baseIsOutOfView(b1)).toBeTruthy();
    
    // multiple characters
    seq = Sequence.createOutOfView(svg, createUUIDforSVG(), 'aqt');
    expect(seq.length).toBe(3);
    b1 = seq.getBaseAtPosition(1);
    expect(b1.character).toBe('a');
    expect(baseIsOutOfView(b1)).toBeTruthy();
    let b2 = seq.getBaseAtPosition(2);
    expect(b2.character).toBe('q');
    expect(baseIsOutOfView(b2)).toBeTruthy();
    let b3 = seq.getBaseAtPosition(3);
    expect(b3.character).toBe('t');
    expect(baseIsOutOfView(b3)).toBeTruthy();
  });

  it('basic test of constructor', () => {
    let id = createUUIDforSVG();
    expect(() => new Sequence(id)).not.toThrow();
  });

  it('id getter', () => {
    let id = createUUIDforSVG();
    let seq = new Sequence(id);
    expect(seq.id).toBe(id);
  });

  it('numberingOffset getter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    
    // a positive value
    seq.setNumberingOffset(5, svg);
    expect(seq.numberingOffset).toBe(5);

    // a negative value
    seq.setNumberingOffset(-10, svg);
    expect(seq.numberingOffset).toBe(-10);
  });

  it('numberingOffset is zero by default', () => {
    let seq = new Sequence(createUUIDforSVG());
    expect(seq.numberingOffset).toBe(0);
  });

  it('numberingOffset setter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // empty sequence
    expect(() => seq.setNumberingOffset(101, svg)).not.toThrow();
    expect(seq.numberingOffset).toBe(101);

    // with no base numberings
    seq.setNumberingAnchor(0, svg);
    seq.setNumberingIncrement(20, svg);
    let b1 = Base.create(svg, 'a', 1.1, -2.2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'G', 10.0, 111);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'C', 11.0032, -123);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'b', 0, 0);
    seq.appendBase(b4, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();
    expect(() => seq.setNumberingOffset(123, svg)).not.toThrow();
    expect(seq.numberingOffset).toBe(123);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();

    // with some base numberings
    seq.setNumberingAnchor(1, svg);
    seq.setNumberingIncrement(2, svg);
    expect(b1.hasNumbering()).toBeTruthy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeTruthy();
    expect(b4.hasNumbering()).toBeFalsy();
    expect(() => seq.setNumberingOffset(12, svg)).not.toThrow();
    expect(b1.numbering.number).toBe(13);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(15);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to a positive number
    seq.setNumberingOffset(123, svg);
    expect(b1.numbering.number).toBe(124);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(126);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to zero
    seq.setNumberingOffset(0, svg);
    expect(b1.numbering.number).toBe(1);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(3);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to a negative number
    seq.setNumberingOffset(-87, svg);
    expect(b1.numbering.number).toBe(-86);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(-84);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to positive and negative non-integer values
    expect(() => seq.setNumberingOffset(0.1, svg)).toThrow();
    expect(() => seq.setNumberingOffset(-0.3, svg)).toThrow();

    // settings to nonfinite numbers
    expect(() => seq.setNumberingOffset(NaN, svg)).toThrow();
    expect(() => seq.setNumberingOffset(Infinity, svg)).toThrow();
    expect(() => seq.setNumberingOffset(-Infinity, svg)).toThrow();
  });

  it('numberingAnchor getter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // a positive value
    seq.setNumberingAnchor(8, svg);
    expect(seq.numberingAnchor).toBe(8);

    // a negative value
    seq.setNumberingAnchor(-9, svg);
    expect(seq.numberingAnchor).toBe(-9);
  });

  it('numberingAnchor is zero by default', () => {
    let seq = new Sequence(createUUIDforSVG());
    expect(seq.numberingAnchor).toBe(0);
  });

  it('numberingAnchor setter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // empty sequence
    expect(() => seq.setNumberingAnchor(11, svg)).not.toThrow();
    expect(seq.numberingAnchor).toBe(11);

    // with no base numberings
    seq.setNumberingAnchor(0, svg);
    seq.setNumberingIncrement(20, svg);
    let b1 = Base.create(svg, 'a', 1.1, -2.2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'G', 10.0, 111);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'C', 11.0032, -123);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'b', 0, 0);
    seq.appendBase(b4, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();
    expect(() => seq.setNumberingAnchor(5, svg)).not.toThrow();
    expect(seq.numberingAnchor).toBe(5);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();

    // with some base numberings
    seq.setNumberingAnchor(2, svg);
    seq.setNumberingIncrement(2, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeTruthy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeTruthy();
    expect(() => seq.setNumberingAnchor(1, svg)).not.toThrow();
    expect(b1.numbering.number).toBe(1);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(3);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to a positive number
    seq.setNumberingAnchor(3, svg);
    expect(b1.numbering.number).toBe(1);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(3);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to zero
    seq.setNumberingAnchor(0, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(2);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(4);

    // setting to a negative number
    seq.setNumberingAnchor(-2, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(2);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(4);

    // setting to greater than sequence length
    seq.setNumberingAnchor(6, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(2);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(4);

    // setting with a nonzero numbering offset
    seq.setNumberingOffset(1, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(3);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(5);
    seq.setNumberingAnchor(1, svg);
    expect(b1.numbering.number).toBe(2);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(4);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to positive and negative non-integer values
    expect(() => seq.setNumberingAnchor(0.1, svg)).toThrow();
    expect(() => seq.setNumberingAnchor(-0.3, svg)).toThrow();

    // settings to nonfinite numbers
    expect(() => seq.setNumberingAnchor(NaN, svg)).toThrow();
    expect(() => seq.setNumberingAnchor(Infinity, svg)).toThrow();
    expect(() => seq.setNumberingAnchor(-Infinity, svg)).toThrow();

    // updates most recent properties
    let na = Sequence.mostRecentProps().numberingAnchor + 5;
    seq.setNumberingAnchor(na, svg);
    expect(seq.numberingAnchor).toBe(na);
    expect(Sequence.mostRecentProps().numberingAnchor).toBe(na);
  });

  it('numberingIncrement getter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    seq.setNumberingIncrement(7, svg);
    expect(seq.numberingIncrement).toBe(7);
  });

  it('numberingIncrement default value', () => {
    let seq = new Sequence(createUUIDforSVG());
    expect(seq.numberingIncrement).toBe(20);
  });

  it('numberingIncrement setter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // empty sequence
    expect(() => seq.setNumberingIncrement(12, svg)).not.toThrow();
    expect(seq.numberingIncrement).toBe(12);

    // with no base numberings
    seq.setNumberingAnchor(0, svg);
    seq.setNumberingIncrement(20, svg);
    let b1 = Base.create(svg, 'a', 1.1, -2.2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'G', 10.0, 111);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'C', 11.0032, -123);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'b', 0, 0);
    seq.appendBase(b4, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();
    expect(() => seq.setNumberingIncrement(50, svg)).not.toThrow();
    expect(seq.numberingIncrement).toBe(50);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();

    // with some base numberings
    seq.setNumberingAnchor(1, svg);
    seq.setNumberingIncrement(2, svg);
    expect(b1.hasNumbering()).toBeTruthy();
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeTruthy();
    expect(b4.hasNumbering()).toBeFalsy();
    expect(() => seq.setNumberingIncrement(3, svg)).not.toThrow();
    expect(b1.numbering.number).toBe(1);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(4);

    // setting to a positive number
    seq.setNumberingIncrement(2, svg);
    expect(b1.numbering.number).toBe(1);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(3);
    expect(b4.hasNumbering()).toBeFalsy();

    // setting to one
    seq.setNumberingIncrement(1, svg);
    expect(b1.numbering.number).toBe(1);
    expect(b2.numbering.number).toBe(2);
    expect(b3.numbering.number).toBe(3);
    expect(b4.numbering.number).toBe(4);

    // setting to greater than sequence length
    seq.setNumberingAnchor(2, svg);
    seq.setNumberingIncrement(6, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(2);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();

    // setting with a nonzero numbering offset
    seq.setNumberingOffset(5, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(7);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.hasNumbering()).toBeFalsy();
    seq.setNumberingIncrement(2, svg);
    expect(b1.hasNumbering()).toBeFalsy();
    expect(b2.numbering.number).toBe(7);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(9);

    // can increment upwards and downwards
    seq.setNumberingAnchor(3, svg);
    expect(b1.numbering.number).toBe(6);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.numbering.number).toBe(8);
    expect(b4.hasNumbering()).toBeFalsy();
    seq.setNumberingIncrement(1, svg);
    expect(b1.numbering.number).toBe(6);
    expect(b2.numbering.number).toBe(7);
    expect(b3.numbering.number).toBe(8);
    expect(b4.numbering.number).toBe(9);

    // setting to zero and negative values
    expect(() => seq.setNumberingIncrement(0, svg)).toThrow();
    expect(() => seq.setNumberingIncrement(-2, svg)).toThrow();

    // setting to positive and negative non-integer values
    expect(() => seq.setNumberingIncrement(0.1, svg)).toThrow();
    expect(() => seq.setNumberingIncrement(-0.3, svg)).toThrow();

    // settings to nonfinite numbers
    expect(() => seq.setNumberingIncrement(NaN, svg)).toThrow();
    expect(() => seq.setNumberingIncrement(Infinity, svg)).toThrow();
    expect(() => seq.setNumberingIncrement(-Infinity, svg)).toThrow();

    // updates most recent properties
    let ni = Sequence.mostRecentProps().numberingIncrement + 3;
    seq.setNumberingIncrement(ni, svg);
    expect(seq.numberingIncrement).toBe(ni);
    expect(Sequence.mostRecentProps().numberingIncrement).toBe(ni);
  });

  it('length getter', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    expect(seq.length).toBe(0);

    seq.appendBase(Base.create(svg, 'A', 1, 2), svg);
    seq.appendBase(Base.create(svg, 'U', 2, 2), svg);
    expect(seq.length).toBe(2);
    
    seq.removeBaseAtPosition(1);
    expect(seq.length).toBe(1);

    seq.appendBase(Base.create(svg, 't', 9, 0), svg);
    expect(seq.length).toBe(2);

    seq.removeBaseAtPosition(2);
    seq.removeBaseAtPosition(1);
    expect(seq.length).toBe(0);
  });

  it('offsetPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    
    // positive numbering offset
    seq.setNumberingOffset(3, svg);
    
    // positive, zero, and negative input position
    expect(seq.offsetPosition(2)).toBe(5);
    expect(seq.offsetPosition(0)).toBe(3);
    expect(seq.offsetPosition(-4)).toBe(-1);

    // zero numbering offset
    seq.setNumberingOffset(0, svg);

    // positive, zero, and negative input position
    expect(seq.offsetPosition(2)).toBe(2);
    expect(seq.offsetPosition(0)).toBe(0);
    expect(seq.offsetPosition(-4)).toBe(-4);

    // negative numbering offset
    seq.setNumberingOffset(-10, svg);

    // positive, zero, and negative input position
    expect(seq.offsetPosition(2)).toBe(-8);
    expect(seq.offsetPosition(0)).toBe(-10);
    expect(seq.offsetPosition(-4)).toBe(-14);
  });

  it('reversePositionOffset method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // positive numbering offset
    seq.setNumberingOffset(6, svg);

    // positive, zero, and negative input offset position
    expect(seq.reversePositionOffset(8)).toBe(2);
    expect(seq.reversePositionOffset(0)).toBe(-6);
    expect(seq.reversePositionOffset(-2)).toBe(-8);

    // zero numbering offset
    seq.setNumberingOffset(0, svg);

    // positive, zero, and negative input offset position
    expect(seq.reversePositionOffset(8)).toBe(8);
    expect(seq.reversePositionOffset(0)).toBe(0);
    expect(seq.reversePositionOffset(-2)).toBe(-2);

    // negative numbering offset
    seq.setNumberingOffset(-5, svg);

    // positive, zero, and negative input offset position
    expect(seq.reversePositionOffset(8)).toBe(13);
    expect(seq.reversePositionOffset(0)).toBe(5);
    expect(seq.reversePositionOffset(-2)).toBe(3);
  });

  it('positionOutOfRange method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // empty sequence
    expect(seq.positionOutOfRange(1)).toBeTruthy();

    // position that is in middle of range
    seq.appendBase(Base.create(svg, 'a', 1, 2), svg);
    seq.appendBase(Base.create(svg, 'w', 3, 4), svg);
    seq.appendBase(Base.create(svg, 'l', 2, 2), svg);
    seq.appendBase(Base.create(svg, 'p', 1, 1), svg);
    expect(seq.positionOutOfRange(2)).toBeFalsy();
    expect(seq.positionOutOfRange(3)).toBeFalsy();

    // position of one
    expect(seq.positionOutOfRange(1)).toBeFalsy();

    // the sequence length
    expect(seq.positionOutOfRange(4)).toBeFalsy();

    // position of zero
    expect(seq.positionOutOfRange(0)).toBeTruthy();

    // negative position
    expect(seq.positionOutOfRange(-1)).toBeTruthy();

    // position that is just greater than sequence length
    expect(seq.positionOutOfRange(5)).toBeTruthy();

    // position greater than sequence length
    expect(seq.positionOutOfRange(8)).toBeTruthy();
  });

  it('positionInRange method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // empty sequence
    expect(seq.positionInRange(1)).toBeFalsy();

    // position that is in middle of range
    seq.appendBase(Base.create(svg, 'a', 1, 2), svg);
    seq.appendBase(Base.create(svg, 'w', 3, 4), svg);
    seq.appendBase(Base.create(svg, 'l', 2, 2), svg);
    seq.appendBase(Base.create(svg, 'p', 1, 1), svg);
    expect(seq.positionInRange(2)).toBeTruthy();
    expect(seq.positionInRange(3)).toBeTruthy();

    // position of one
    expect(seq.positionInRange(1)).toBeTruthy();

    // the sequence length
    expect(seq.positionInRange(4)).toBeTruthy();

    // position of zero
    expect(seq.positionInRange(0)).toBeFalsy();

    // negative position
    expect(seq.positionInRange(-1)).toBeFalsy();

    // position that is just greater than sequence length
    expect(seq.positionInRange(5)).toBeFalsy();

    // position greater than sequence length
    expect(seq.positionInRange(8)).toBeFalsy();
  });

  it('offsetPositionOutOfRange method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    seq.setNumberingOffset(20, svg);

    // empty sequence
    expect(seq.offsetPositionOutOfRange(21)).toBeTruthy();

    // position that is in middle of range
    seq.appendBase(Base.create(svg, 'a', 1, 2), svg);
    seq.appendBase(Base.create(svg, 'w', 3, 4), svg);
    seq.appendBase(Base.create(svg, 'l', 2, 2), svg);
    seq.appendBase(Base.create(svg, 'p', 1, 1), svg);
    expect(seq.offsetPositionOutOfRange(22)).toBeFalsy();
    expect(seq.offsetPositionOutOfRange(23)).toBeFalsy();

    // position at low end of range
    expect(seq.offsetPositionOutOfRange(21)).toBeFalsy();

    // position at high end of range
    expect(seq.offsetPositionOutOfRange(24)).toBeFalsy();

    // position just below the low end of the range
    expect(seq.offsetPositionOutOfRange(20)).toBeTruthy();

    // position of zero
    expect(seq.offsetPositionOutOfRange(0)).toBeTruthy();

    // negative position
    expect(seq.offsetPositionOutOfRange(-1)).toBeTruthy();

    // position just greater than the high end of the range
    expect(seq.offsetPositionOutOfRange(25)).toBeTruthy();

    // position greater than the high end of the range
    expect(seq.offsetPositionOutOfRange(28)).toBeTruthy();
  });

  it('offsetPositionInRange method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    seq.setNumberingOffset(10, svg);

    // empty sequence
    expect(seq.offsetPositionInRange(11)).toBeFalsy();

    // position that is in middle of range
    seq.appendBase(Base.create(svg, 'a', 1, 2), svg);
    seq.appendBase(Base.create(svg, 'w', 3, 4), svg);
    seq.appendBase(Base.create(svg, 'l', 2, 2), svg);
    seq.appendBase(Base.create(svg, 'p', 1, 1), svg);
    expect(seq.offsetPositionInRange(12)).toBeTruthy();
    expect(seq.offsetPositionInRange(13)).toBeTruthy();

    // position at low end of range
    expect(seq.offsetPositionInRange(11)).toBeTruthy();

    // position at high end of range
    expect(seq.offsetPositionInRange(14)).toBeTruthy();

    // position just below the low end of the range
    expect(seq.offsetPositionInRange(10)).toBeFalsy();

    // position of zero
    expect(seq.offsetPositionInRange(0)).toBeFalsy();

    // negative position
    expect(seq.offsetPositionInRange(-1)).toBeFalsy();

    // position that is just greater than high end of range
    expect(seq.offsetPositionInRange(15)).toBeFalsy();

    // position higher than the high end of the range
    expect(seq.offsetPositionInRange(18)).toBeFalsy();
  });

  it('getBaseAtPosition', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    
    let b1 = Base.create(svg, 'A', 1, 2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'U', 2, 2);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'G', 3, 2);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'k', 0, 0);
    seq.appendBase(b4, svg);
    expect(seq.length).toBe(4);

    // position in middle of range
    expect(seq.getBaseAtPosition(2).id).toBe(b2.id);
    expect(seq.getBaseAtPosition(3).id).toBe(b3.id);

    // position of one
    expect(seq.getBaseAtPosition(1).id).toBe(b1.id);

    // the sequence length
    expect(seq.getBaseAtPosition(4).id).toBe(b4.id);

    // position of zero
    expect(seq.getBaseAtPosition(0)).toBe(null);

    // position just greater than sequence length
    expect(seq.getBaseAtPosition(5)).toBe(null);

    // negative position
    expect(seq.getBaseAtPosition(-1)).toBe(null);

    // position greater than sequence length
    expect(seq.getBaseAtPosition(12)).toBe(null);
  });

  it('getBaseAtOffsetPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    seq.setNumberingOffset(30, svg);

    let b1 = Base.create(svg, 'A', 1, 2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'U', 2, 2);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'G', 3, 2);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'k', 0, 0);
    seq.appendBase(b4, svg);
    expect(seq.length).toBe(4);

    // position in middle of range
    expect(seq.getBaseAtOffsetPosition(32).id).toBe(b2.id);
    expect(seq.getBaseAtOffsetPosition(33).id).toBe(b3.id);

    // position at low end of range
    expect(seq.getBaseAtOffsetPosition(31).id).toBe(b1.id);

    // position at high end of range
    expect(seq.getBaseAtOffsetPosition(34).id).toBe(b4.id);

    // position just below the low end of the range
    expect(seq.getBaseAtOffsetPosition(30)).toBe(null);

    // position just greater than the high end of the range
    expect(seq.getBaseAtOffsetPosition(35)).toBe(null);

    // position of zero
    expect(seq.getBaseAtOffsetPosition(0)).toBe(null);

    // negative position
    expect(seq.getBaseAtOffsetPosition(-1)).toBe(null);

    // position greater than high end of range
    expect(seq.getBaseAtOffsetPosition(42)).toBe(null);
  });

  it('getBaseById method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'e', 1, 2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'b', 1, 1);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'r', 0.01, 0.04);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'n', -1, -2.2);
    expect(seq.length).toBe(3);

    expect(seq.getBaseById(b1.id)).toBe(b1);
    expect(seq.getBaseById(b2.id)).toBe(b2);
    expect(seq.getBaseById(b3.id)).toBe(b3);
    expect(seq.getBaseById(b4.id)).toBe(null);
  });

  describe('getBasesInRange method', () => {
    it('basic case', () => {
      let svg = createNodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'asdfasdf');
      let bases = seq.getBasesInRange(3, 6);
      expect(bases.length).toBe(4);
      expect(bases[0].character).toBe('d');
      expect(bases[1].character).toBe('f');
      expect(bases[2].character).toBe('a');
      expect(bases[3].character).toBe('s');
    });

    it('invalid range', () => {
      let svg = createNodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'asdfasdf');
      let bases = seq.getBasesInRange(7, 3);
      expect(bases.length).toBe(0);
    });
  });

  describe('forEachBase method', () => {
    it('multiple bases', () => {
      let svg = createNodeSVG();
      let seq = new Sequence(createUUIDforSVG());
      let b1 = Base.create(svg, 'a', 1, 2);
      seq.appendBase(b1, svg);
      let b2 = Base.create(svg, 'q', 5, 6);
      seq.appendBase(b2, svg);
      let ids = [b1.id, b2.id];
      let i = 0;
      seq.forEachBase(b => {
        expect(b.id).toBe(ids[i]);
        i++;
      });
      expect(i).toBe(2);
    });
  });

  describe('baseIds method', () => {
    it('multiple bases', () => {
      let svg = createNodeSVG();
      let seq = new Sequence('asdf');
      let b1 = Base.create(svg, 'b', 0, 0);
      seq.appendBase(b1, svg);
      let b2 = Base.create(svg, 'h', 2, 2);
      seq.appendBase(b2, svg);
      let ids = seq.baseIds();
      expect(ids.length).toBe(2);
      expect(ids[0]).toBe(b1.id);
      expect(ids[1]).toBe(b2.id);
    });
  });

  it('positionOfBase method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'e', 1, 2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'b', 1, 1);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'r', 0.01, 0.04);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'n', -1, -2.2);
    expect(seq.length).toBe(3);

    expect(seq.positionOfBase(b1)).toBe(1);
    expect(seq.positionOfBase(b2)).toBe(2);
    expect(seq.positionOfBase(b3)).toBe(3);
    expect(seq.positionOfBase(b4)).toBe(0);
  });

  it('offsetPositionOfBase method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'e', 1, 2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'b', 1, 1);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'r', 0.01, 0.04);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'n', -1, -2.2);
    expect(seq.length).toBe(3);

    seq.setNumberingOffset(8, svg);
    expect(seq.offsetPositionOfBase(b1)).toBe(9);
    expect(seq.offsetPositionOfBase(b2)).toBe(10);
    expect(seq.offsetPositionOfBase(b3)).toBe(11);
    expect(seq.offsetPositionOfBase(b4)).toBe(8);
  });

  it('containsBase method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'a', 1, 2);
    let b2 = Base.create(svg, 'g', 3, 4);
    let b3 = Base.create(svg, 'v', 1, 5);
    let b4 = Base.create(svg, 'q', -0.1, -1);

    // on empty sequence
    expect(seq.containsBase(b1)).toBeFalsy();

    seq.appendBase(b1);
    seq.appendBase(b2);
    seq.appendBase(b3);

    // the first base
    expect(seq.containsBase(b1)).toBeTruthy();

    // middle base
    expect(seq.containsBase(b2)).toBeTruthy();

    // the last base
    expect(seq.containsBase(b3)).toBeTruthy();

    // not in the sequence
    expect(seq.containsBase(b4)).toBeFalsy();
  });

  it('clockwiseNormalAngleAtPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    
    let b1 = Base.create(svg, 'A', 1, 2);
    let b2 = Base.create(svg, 'G', 3, 4);
    let b3 = Base.create(svg, 't', -0.5, -0.6);

    // no 5' or 3' bases
    seq.appendBase(b1);
    
    expect(
      seq.clockwiseNormalAngleAtPosition(1)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
        null,
      ),
      6,
    );

    // only a 3' base
    seq.appendBase(b2);

    expect(
      seq.clockwiseNormalAngleAtPosition(1)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
      ),
      6,
    );

    // only a 5' base
    expect(
      seq.clockwiseNormalAngleAtPosition(2)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
      ),
      6,
    );

    // both a 5' and 3' base
    seq.appendBase(b3);

    expect(
      seq.clockwiseNormalAngleAtPosition(2)
    ).toBeCloseTo(
      Sequence._clockwiseNormalAngleOfBase(
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        { xCenter: b3.xCenter, yCenter: b3.yCenter },
      ),
      6,
    );

    // position out of range
    expect(
      seq.clockwiseNormalAngleAtPosition(4)
    ).toBe(null);
  });

  it('counterClockwiseNormalAngleAtPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    
    let b1 = Base.create(svg, 'A', 1, 2);
    seq.appendBase(b1);
    let b2 = Base.create(svg, 'G', 3, 4);
    seq.appendBase(b2);
    let b3 = Base.create(svg, 't', -0.5, -0.6);
    seq.appendBase(b3);

    // just check that it returns Math.PI plus the clockwise normal angle
    expect(
      seq.counterClockwiseNormalAngleAtPosition(2)
    ).toBeCloseTo(
      seq.clockwiseNormalAngleAtPosition(2) + Math.PI,
      6,
    );

    // position out of range
    expect(
      seq.counterClockwiseNormalAngleAtPosition(4)
    ).toBe(null);
  });

  it('innerNormalAngleAtPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'A', 1, 2);
    let b2 = Base.create(svg, 'G', 3, 4);
    let b3 = Base.create(svg, 't', -0.5, -0.6);

    // no 5' or 3' bases
    seq.appendBase(b1);

    expect(
      seq.innerNormalAngleAtPosition(1)
    ).toBeCloseTo(
      Sequence._innerNormalAngleOfBase(
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
        null,
      ),
      6,
    );

    // only a 3' base
    seq.appendBase(b2);

    expect(
      seq.innerNormalAngleAtPosition(1)
    ).toBeCloseTo(
      Sequence._innerNormalAngleOfBase(
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
      ),
      6,
    );

    // only a 5' base
    expect(
      seq.innerNormalAngleAtPosition(2)
    ).toBeCloseTo(
      Sequence._innerNormalAngleOfBase(
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        null,
      ),
      6,
    );

    // both a 5' and 3' base
    seq.appendBase(b3);

    expect(
      seq.innerNormalAngleAtPosition(2)
    ).toBeCloseTo(
      Sequence._innerNormalAngleOfBase(
        { xCenter: b2.xCenter, yCenter: b2.yCenter },
        { xCenter: b1.xCenter, yCenter: b1.yCenter },
        { xCenter: b3.xCenter, yCenter: b3.yCenter },
      ),
      6,
    );

    // position out of range
    expect(
      seq.innerNormalAngleAtPosition(4)
    ).toBe(null);
  });

  it('outerNormalAngleAtPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'A', 1, 2);
    seq.appendBase(b1);
    let b2 = Base.create(svg, 'G', 3, 4);
    seq.appendBase(b2);
    let b3 = Base.create(svg, 't', -0.5, -0.6);
    seq.appendBase(b3);

    // just check that it returns Math.PI plus the inner normal angle
    expect(
      seq.outerNormalAngleAtPosition(2)
    ).toBeCloseTo(
      seq.innerNormalAngleAtPosition(2) + Math.PI,
      6,
    );

    // position out of range
    expect(
      seq.outerNormalAngleAtPosition(4)
    ).toBe(null);
  });

  it('appendBase method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // appending to empty sequence
    expect(seq.length).toBe(0);
    let b1 = Base.create(svg, 'A', 1, 3);
    seq.appendBase(b1, svg);
    expect(seq.length).toBe(1);
    expect(seq.getBaseAtPosition(1)).toBe(b1);

    // appending to a nonempty sequence
    let b2 = Base.create(svg, 'a', 3, 3);
    seq.appendBase(b2, svg);
    expect(seq.length).toBe(2);
    let b3 = Base.create(svg, 'w', 5, 4);
    seq.appendBase(b3, svg);
    expect(seq.length).toBe(3);
    expect(seq.getBaseAtPosition(1)).toBe(b1);
    expect(seq.getBaseAtPosition(2)).toBe(b2);
    expect(seq.getBaseAtPosition(3)).toBe(b3);

    // appending a base that is already in the sequence
    expect(() => seq.appendBase(b2)).toThrow();
    expect(seq.length).toBe(3);
    
    // base numberings are updated
    seq.setNumberingAnchor(1, svg);
    seq.setNumberingIncrement(3, svg);
    expect(seq.length).toBe(3);
    let b4 = Base.create(svg, 't', 5, 6);
    seq.appendBase(b4, svg);
    expect(seq.length).toBe(4);
    expect(b1.numbering.number).toBe(1);
    expect(b2.hasNumbering()).toBeFalsy();
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b4.numbering.number).toBe(4);
  });

  describe('appendBases method', () => {
    it('sequence already contains one of the given bases', () => {
      let svg = createNodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'asdf');
      let b1 = Base.create(svg, 'Q', 1, 5);
      let b2 = seq.getBaseAtPosition(3);
      let b3 = Base.create(svg, 'H', 5, 6);
      expect(seq.length).toBe(4);
      seq.appendBases([b1, b2, b3], svg);
      expect(seq.length).toBe(4);
    });

    it('sequence does not contain any of the given bases', () => {
      let svg = createNodeSVG();
      let seq = Sequence.createOutOfView(svg, 'QQE', 'qqe');
      let b1 = Base.create(svg, 'T', 3, 1);
      let b2 = Base.create(svg, 'B', 3, 3);
      expect(seq.length).toBe(3);
      seq.appendBases([b1, b2], svg);
      expect(seq.length).toBe(5);
      expect(seq.getBaseAtPosition(4).id).toBe(b1.id);
      expect(seq.getBaseAtPosition(5).id).toBe(b2.id);
    });

    it('updates base numberings', () => {
      let svg = createNodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'asdfasdfasdfasdfasdf');
      seq.setNumberingAnchor(12, svg);
      seq.setNumberingIncrement(10, svg);
      expect(seq.getBaseAtPosition(2).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(12).hasNumbering()).toBeTruthy();
      let bases = [
        Base.create(svg, 'a', 1, 2),
        Base.create(svg, 't', 5, 6),
        Base.create(svg, 'r', 6, 9),
      ];
      seq.appendBases(bases, svg);
      expect(seq.getBaseAtPosition(2).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(12).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(21).hasNumbering()).toBeFalsy();
      expect(seq.getBaseAtPosition(22).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(23).hasNumbering()).toBeFalsy();
    });
  });

  it('insertBaseAtPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // inserting below range of empty sequence
    let b1 = Base.create(svg, 'a', 2, 3);
    expect(() => seq.insertBaseAtPosition(b1, 0, svg)).toThrow();

    // inserting above range of empty sequence
    expect(() => seq.insertBaseAtPosition(b1, 2, svg)).toThrow();

    // inserting into empty sequence
    seq.insertBaseAtPosition(b1, 1, svg);
    expect(seq.length).toBe(1);
    expect(seq.getBaseAtPosition(1)).toBe(b1);

    let b2 = Base.create(svg, 'g', 1, 4);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'k', 5.5, 6.3);
    seq.appendBase(b3, svg);

    // inserting below range
    let b4 = Base.create(svg, 'e', 5, 5);
    expect(() => seq.insertBaseAtPosition(b4, 0, svg)).toThrow();

    // inserting above range
    expect(() => seq.insertBaseAtPosition(b4, 5, svg)).toThrow();

    // inserting at the low end
    seq.insertBaseAtPosition(b4, 1, svg);
    expect(seq.length).toBe(4);
    expect(seq.getBaseAtPosition(1)).toBe(b4);

    // inserting at the high end
    let b5 = Base.create(svg, 'b', 3, -1);
    seq.insertBaseAtPosition(b5, 4, svg);
    expect(seq.length).toBe(5);
    expect(seq.getBaseAtPosition(4)).toBe(b5);
    
    // inserting just above the high end
    let b6 = Base.create(svg, 'w', 1, 5);
    seq.insertBaseAtPosition(b6, 6, svg);
    expect(seq.length).toBe(6);
    expect(seq.getBaseAtPosition(6)).toBe(b6);

    // inserting in the middle
    let b7 = Base.create(svg, 'h', 7, 10);
    seq.insertBaseAtPosition(b7, 3, svg);
    expect(seq.length).toBe(7);
    expect(seq.getBaseAtPosition(3)).toBe(b7);

    // check complete sequence
    expect(seq.getBaseAtPosition(1)).toBe(b4);
    expect(seq.getBaseAtPosition(2)).toBe(b1);
    expect(seq.getBaseAtPosition(3)).toBe(b7);
    expect(seq.getBaseAtPosition(4)).toBe(b2);
    expect(seq.getBaseAtPosition(5)).toBe(b5);
    expect(seq.getBaseAtPosition(6)).toBe(b3);
    expect(seq.getBaseAtPosition(7)).toBe(b6);

    // inserting a base that is already in the sequence
    expect(() => seq.insertBaseAtPosition(b2, 4, svg)).toThrow();

    // base numberings are updated
    seq.setNumberingAnchor(2, svg);
    seq.setNumberingIncrement(3, svg);
    let b8 = Base.create(svg, 'q', 4, 4);
    seq.insertBaseAtPosition(b8, 6, svg);
    expect(seq.length).toBe(8);
    expect(seq.getBaseAtPosition(1).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(2).numbering.number).toBe(2);
    expect(seq.getBaseAtPosition(3).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(4).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(5).numbering.number).toBe(5);
    expect(seq.getBaseAtPosition(6).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(7).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(8).numbering.number).toBe(8);
  });

  it('removeBaseAtPosition method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    // calling on an empty sequence
    expect(seq.length).toBe(0);
    expect(() => seq.removeBaseAtPosition(0, svg)).not.toThrow();
    expect(() => seq.removeBaseAtPosition(1, svg)).not.toThrow();
    expect(() => seq.removeBaseAtPosition(-1, svg)).not.toThrow();
    expect(seq.length).toBe(0);

    let b1 = Base.create(svg, 'a', 1, 2);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'b', 4, 3);
    seq.appendBase(b2, svg);
    let b3 = Base.create(svg, 'q', 6, 5);
    seq.appendBase(b3, svg);
    let b4 = Base.create(svg, 'i', 7, 8);
    seq.appendBase(b4, svg);
    expect(seq.length).toBe(4);

    // position of zero
    expect(() => seq.removeBaseAtPosition(0, svg)).not.toThrow();
    expect(seq.length).toBe(4);
    
    // negative position
    expect(() => seq.removeBaseAtPosition(-1, svg)).not.toThrow();
    expect(seq.length).toBe(4);

    // position is greater than sequence length
    expect(() => seq.removeBaseAtPosition(5, svg)).not.toThrow();
    expect(seq.length).toBe(4);

    // removing a middle base
    let id2 = b2.id;
    expect(seq.getBaseById(id2)).toBe(b2);
    seq.removeBaseAtPosition(2, svg);
    expect(seq.getBaseById(id2)).toBe(null);
    
    // removing the first base
    let id1 = b1.id;
    expect(seq.getBaseById(id1)).toBe(b1);
    seq.removeBaseAtPosition(1, svg);
    expect(seq.getBaseById(id1)).toBe(null)

    // removing the last base
    let id4 = b4.id;
    expect(seq.getBaseById(id4)).toBe(b4);
    seq.removeBaseAtPosition(2, svg);
    expect(seq.getBaseById(id4)).toBe(null);

    let b5 = Base.create(svg, 't', 3, 4);
    seq.appendBase(b5, svg);
    let b6 = Base.create(svg, 'w', 1, 2);
    seq.appendBase(b6, svg);
    expect(seq.getBaseAtPosition(1)).toBe(b3);
    expect(seq.getBaseAtPosition(2)).toBe(b5);
    expect(seq.getBaseAtPosition(3)).toBe(b6);
    
    // base numberings are updated
    seq.setNumberingAnchor(2, svg);
    seq.setNumberingIncrement(5, svg);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b5.numbering.number).toBe(2);
    expect(b6.hasNumbering()).toBeFalsy();
    seq.removeBaseAtPosition(2, svg);
    expect(b3.hasNumbering()).toBeFalsy();
    expect(b6.numbering.number).toBe(2);
    
    // remove method of base is called when base is removed
    let textId6 = b6._text.id();
    expect(svg.findOne('#' + textId6)).not.toBe(null);
    seq.removeBaseAtPosition(2, svg);
    expect(svg.findOne('#' + textId6)).toBe(null);
  });

  it('remove method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());
    let b1 = Base.create(svg, 'a', 1, 2);
    seq.appendBase(b1);
    let b2 = Base.create(svg, 'g', 3, 4);
    seq.appendBase(b2);
    expect(svg.findOne('#' + b1._text.id())).not.toBe(null);
    expect(svg.findOne('#' + b2._text.id())).not.toBe(null);
    seq.remove();
    expect(svg.findOne('#' + b1._text.id())).toBe(null);
    expect(svg.findOne('#' + b2._text.id())).toBe(null);
  });

  it('savableState method', () => {
    let svg = createNodeSVG();
    let seq = new Sequence(createUUIDforSVG());

    let b1 = Base.create(svg, 'A', 2, 4);
    seq.appendBase(b1, svg);
    let b2 = Base.create(svg, 'a', 5, 4);
    seq.appendBase(b2, svg);

    // base 2 will have a numbering
    seq.setNumberingOffset(5, svg);
    seq.setNumberingAnchor(2, svg);
    seq.setNumberingIncrement(7, svg);

    let savableState = seq.savableState();

    expect(savableState.className).toBe('Sequence');
    expect(savableState.numberingOffset).toBe(5);
    expect(savableState.numberingAnchor).toBe(2);
    expect(savableState.numberingIncrement).toBe(7);

    expect(
      JSON.stringify(savableState.bases[0])
    ).toBe(JSON.stringify(b1.savableState()));

    expect(
      JSON.stringify(savableState.bases[1])
    ).toBe(JSON.stringify(b2.savableState()));
  });
});
