import { StraightBond, PrimaryBond, SecondaryBond } from './StraightBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

it('mostRecentProps static method returns a new object', () => {
  function runFor(StraightBondClass) {
    let mrps = StraightBondClass.mostRecentProps();
    expect(mrps).not.toBe(StraightBondClass._mostRecentProps);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('PrimaryBond _applyMostRecentProps static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 5, 6);
  let b2 = Base.create(svg, 'g', 1, 3);
  let pb = PrimaryBond.create(svg, b1, b2);
  
  /* Set after creating the primary bond since the create static method itself
  applies the most recent properties. */
  PrimaryBond._mostRecentProps.padding1 = 5.111;
  PrimaryBond._mostRecentProps.padding2 = 1.222;
  PrimaryBond._mostRecentProps.stroke = '#453423';
  PrimaryBond._mostRecentProps.strokeWidth = 5.432;
  
  PrimaryBond._applyMostRecentProps(pb);
  expect(pb.padding1).toBeCloseTo(5.111, 6);
  expect(pb.padding2).toBeCloseTo(1.222, 6);
  expect(pb.stroke).toBe('#453423');
  expect(pb.strokeWidth).toBeCloseTo(5.432, 6);
});

it('SecondaryBond _applyMostRecentProps padding1, padding2, and strokeWidth', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'g', 1, 3);
  let b2 = Base.create(svg, 't', 6, 6);
  let sb = new SecondaryBond(svg, b1, b2);

  /* Set after creating the primary bond since the create static method itself
  applies the most recent properties. */
  SecondaryBond._mostRecentProps.padding1 = 66.5;
  SecondaryBond._mostRecentProps.padding2 = 12.33;
  SecondaryBond._mostRecentProps.strokeWidth = 1.222;
  
  SecondaryBond._applyMostRecentProps(sb);
  expect(sb.padding1).toBeCloseTo(66.5, 6);
  expect(sb.padding2).toBeCloseTo(12.33, 6);
  expect(sb.strokeWidth).toBeCloseTo(1.222, 6);
});

it('SecondaryBond _applyMostRecentProps stroke', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'A', 3, 5);
  let bu = Base.create(svg, 'U', 4, 3);
  let bg = Base.create(svg, 'g', 3, 2);
  let bc = Base.create(svg, 'c', 2, 2);
  let bt = Base.create(svg, 't', 5.5, -5.5);

  let sbau = SecondaryBond.create(svg, bu, ba);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bg, bu);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bt, bg);
  let sbOther = SecondaryBond.create(svg, ba, bc);
  
  /* Set after creating the secondary bond since the create static method itself
  applies the most recent properties. */
  SecondaryBond._mostRecentProps.autStroke = '#aabbcc';
  SecondaryBond._mostRecentProps.gcStroke = '#ccbbaa';
  SecondaryBond._mostRecentProps.gutStroke = '#112233';
  SecondaryBond._mostRecentProps.otherStroke = '#998877';

  SecondaryBond._applyMostRecentProps(sbau);
  expect(sbau.stroke).toBe('#aabbcc');
  SecondaryBond._applyMostRecentProps(sbgc);
  expect(sbgc.stroke).toBe('#ccbbaa');
  SecondaryBond._applyMostRecentProps(sbgu);
  expect(sbgu.stroke).toBe('#112233');
  SecondaryBond._applyMostRecentProps(sbat);
  expect(sbat.stroke).toBe('#aabbcc');
  SecondaryBond._applyMostRecentProps(sbgt);
  expect(sbgt.stroke).toBe('#112233');
  SecondaryBond._applyMostRecentProps(sbOther);
  expect(sbOther.stroke).toBe('#998877');
});

it('PrimaryBond _copyPropsToMostRecent', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'b', 1, 3);
  let b2 = Base.create(svg, 'n', 5, 7);
  let pb = PrimaryBond.create(svg, b1, b2);
  
  pb.padding1 = 5.6789;
  pb.padding2 = 4.365;
  pb.stroke = '#9a8c7b';
  pb.strokeWidth = 3.222;
  PrimaryBond._copyPropsToMostRecent(pb);

  let mrps = PrimaryBond.mostRecentProps();
  expect(mrps.padding1).toBeCloseTo(5.6789, 6);
  expect(mrps.padding2).toBeCloseTo(4.365, 6);
  expect(mrps.stroke).toBe('#9a8c7b');
  expect(mrps.strokeWidth).toBeCloseTo(3.222, 6);
});

it('SecondaryBond _copyPropsToMostRecent padding1, padding2, and strokeWidth', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'e', 5.5, 4);
  let b2 = Base.create(svg, 'w', 4, 3);
  let sb = SecondaryBond.create(svg, b1, b2);

  sb.padding1 = 8.777;
  sb.padding2 = 6.578;
  sb.strokeWidth = 35;
  SecondaryBond._copyPropsToMostRecent(sb);

  let mrps = SecondaryBond.mostRecentProps();
  expect(mrps.padding1).toBeCloseTo(8.777, 6);
  expect(mrps.padding2).toBeCloseTo(6.578, 6);
  expect(mrps.strokeWidth).toBeCloseTo(35, 6);
});

it('SecondaryBond _copyPropsToMostRecent stroke', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'A', 3, 5);
  let bu = Base.create(svg, 'U', 4, 3);
  let bg = Base.create(svg, 'g', 3, 2);
  let bc = Base.create(svg, 'c', 2, 2);
  let bt = Base.create(svg, 't', 5.5, -5.5);

  let sbau = SecondaryBond.create(svg, bu, ba);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bg, bu);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bt, bg);
  let sbOther = SecondaryBond.create(svg, ba, bc);
  
  sbau.stroke = '#123456';
  sbgc.stroke = '#234567';
  sbgu.stroke = '#345678';
  sbat.stroke = '#456789';
  sbgt.stroke = '#567890';
  sbOther.stroke = '#678900';

  SecondaryBond._copyPropsToMostRecent(sbau);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#123456');
  SecondaryBond._copyPropsToMostRecent(sbgc);
  expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#234567');
  SecondaryBond._copyPropsToMostRecent(sbgu);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#345678');
  SecondaryBond._copyPropsToMostRecent(sbat);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#456789');
  SecondaryBond._copyPropsToMostRecent(sbgt);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#567890');
  SecondaryBond._copyPropsToMostRecent(sbOther);
  expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#678900');
});

function checkCoordinates(cs, ecs) {
  expect(cs.x1).toBeCloseTo(ecs.x1, 6);
  expect(cs.y1).toBeCloseTo(ecs.y1, 6);
  expect(cs.x2).toBeCloseTo(ecs.x2, 6);
  expect(cs.y2).toBeCloseTo(ecs.y2, 6);
}

it('StraightBond _lineCoordinates static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 5, 6);
  
  // basic test
  checkCoordinates(
    StraightBond._lineCoordinates(b1, b2, 1, 2),
    {
      x1: 1 + (2 ** -0.5),
      y1: 2 + (2 ** -0.5),
      x2: 5 - (2 ** 0.5),
      y2: 6 - (2 ** 0.5),
    },
  );

  // paddings of zero
  checkCoordinates(
    StraightBond._lineCoordinates(b1, b2, 0, 0),
    {
      x1: 1,
      y1: 2,
      x2: 5,
      y2: 6,
    },
  );

  // negative base coordinates
  b1.moveTo(-2, -1);
  b2.moveTo(-10.5, -100);
  
  checkCoordinates(
    StraightBond._lineCoordinates(b1, b2, 2.5, 1.111),
    {
      x1: -2.2138596577358562,
      y1: -3.49083601362938,
      x2: -10.404960768102185,
      y2: -98.89307247554311,
    },
  );

  // paddings greater than distance between bases
  checkCoordinates(
    StraightBond._lineCoordinates(b1, b2, 60, 60),
    {
      x1: -7.132631785660548,
      y1: -60.78006432710513,
      x2: -5.367368214339452,
      y2: -40.21993567289487,
    },
  );
});

it('_opacity static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'q', 0, 0);
  let b2 = Base.create(svg, 'w', 10, 10);

  // paddings are greater than distance between bases
  expect(StraightBond._opacity(b1, b2, 20, 20)).toBe(0);

  // paddings are less than distance between bases
  expect(StraightBond._opacity(b1, b2, 1, 1)).toBe(1);
});

it('fromSavedState static method valid saved state', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1.1, 1.2);
    let b2 = Base.create(svg, 'U', 2.1, 2.2);
    let sb1 = StraightBondClass.create(svg, b1, b2);

    let savableState = sb1.savableState();

    let getBaseById = (id) => {
      let dict = {};
      dict[b1.id] = b1;
      dict[b2.id] = b2;
      return dict[id];
    };

    let sb2 = StraightBondClass.fromSavedState(savableState, svg, getBaseById);

    expect(sb2._line.id()).toBe(sb1._line.id());
    expect(sb2.base1).toBe(sb1.base1);
    expect(sb2.base2).toBe(sb1.base2);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('fromSavedState static method invalid saved state', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1.1, 1.2);
    let b2 = Base.create(svg, 'U', 2.1, 2.2);
    let sb1 = StraightBondClass.create(svg, b1, b2);

    let getBaseById = (id) => {
      let dict = {};
      dict[b1.id] = b1;
      dict[b2.id] = b2;
      return dict[id];
    };

    let savableState = sb1.savableState();
    expect(() => StraightBondClass.fromSavedState(savableState, svg, getBaseById)).not.toThrow();

    // class name is nonempty and incorrect
    savableState.className = 'StraightBnd';
    expect(StraightBondClass.fromSavedState(savableState, svg, getBaseById)).toBe(null);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('fromSavedState updates most recent padding1, padding2, and strokeWidth properties', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 5, 6);
    let b2 = Base.create(svg, 'e', 0, 0);
    let sb1 = StraightBondClass.create(svg, b1, b2);
    sb1.padding1 = 5;
    sb1.padding2 = 0.5;
    sb1.strokeWidth = 1.65;
    let savableState = sb1.savableState();

    function getBaseById(id) {
      let dict = {};
      dict[b1.id] = b1;
      dict[b2.id] = b2;
      return dict[id];
    }

    let sb2 = StraightBondClass.fromSavedState(savableState, svg, getBaseById);
    let mrps = StraightBondClass.mostRecentProps();
    expect(mrps.padding1).toBeCloseTo(5, 6);
    expect(mrps.padding2).toBeCloseTo(0.5, 6);
    expect(mrps.strokeWidth).toBeCloseTo(1.65, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('PrimaryBond fromSavedState updates most recent stroke property', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 5, 6);
  let b2 = Base.create(svg, 'e', 0, 0);
  let pb1 = PrimaryBond.create(svg, b1, b2);
  pb1.stroke = '#433221';
  let savableState = pb1.savableState();

  function getBaseById(id) {
    let dict = {};
    dict[b1.id] = b1;
    dict[b2.id] = b2;
    return dict[id];
  }

  let pb2 = PrimaryBond.fromSavedState(savableState, svg, getBaseById);
  let mrps = PrimaryBond.mostRecentProps();
  expect(mrps.stroke).toBe('#433221');
});

it('SecondaryBond fromSavedState updates most recent stroke properties', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'a', 4, 1);
  let bu = Base.create(svg, 'U', 7, 100);
  let bg = Base.create(svg, 'G', -10, 5);
  let bc = Base.create(svg, 'c', 11, 33);
  let bt = Base.create(svg, 't', 4, 99);

  let sbau = SecondaryBond.create(svg, ba, bu);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bu, bg);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bg, bt);
  let sbOther = SecondaryBond.create(svg, bg, ba);

  function getBaseById(id) {
    let dict = {};
    dict[ba.id] = ba;
    dict[bu.id] = bu;
    dict[bg.id] = bg;
    dict[bc.id] = bc;
    dict[bt.id] = bt;
    return dict[id];
  }

  sbau.stroke = '#445522';
  let auSavableState = sbau.savableState();
  SecondaryBond.fromSavedState(auSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#445522');
  
  sbgc.stroke = '#aabcde';
  let gcSavableState = sbgc.savableState();
  SecondaryBond.fromSavedState(gcSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#aabcde');

  sbgu.stroke = '#aaabbb';
  let guSavablestate = sbgu.savableState();
  SecondaryBond.fromSavedState(guSavablestate, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#aaabbb');

  sbat.stroke = '#654321';
  let atSavableState = sbat.savableState();
  SecondaryBond.fromSavedState(atSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#654321');

  sbgt.stroke = '#987654';
  let gtSavableState = sbgt.savableState();
  SecondaryBond.fromSavedState(gtSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#987654');

  sbOther.stroke = '#a1b2c3';
  let otherSavableState = sbOther.savableState();
  SecondaryBond.fromSavedState(otherSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#a1b2c3');
});

it('basic test of create static method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 1);
    let b2 = Base.create(svg, 'U', 4, 4);
    let sb = StraightBondClass.create(svg, b1, b2);
    expect(typeof(sb) === 'object' && sb !== null).toBeTruthy();
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('basic test of constructor', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let line = svg.line(0, 0.22, 2.45, -1);
    line.id();
    let b1 = Base.create(svg, 'G', -1, -2);
    let b2 = Base.create(svg, 'C', 10, 0.002);
    expect(() => new StraightBondClass(line, b1, b2)).not.toThrow();
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('_validateLine method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 2);
    let b2 = Base.create(svg, 'U', 2, 3);

    let line1 = svg.line(1, 1, 2, 2);
    line1.id();
    expect(() => new StraightBondClass(line1, b1, b2)).not.toThrow();
    
    // initializes ID
    let line2 = svg.line(1, 4, 3, 5);
    expect(line2.attr('id')).toBe(undefined);
    new StraightBondClass(line2, b1, b2);
    expect(line2.attr('id')).toBeTruthy();
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('base1 and base2 getters', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 4.5, 6);
    let b2 = Base.create(svg, 'u', -10, -4);
    let sb = StraightBondClass.create(svg, b1, b2);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('id getter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b0 = Base.create(svg, 'A', 1, 2);
    let b1 = Base.create(svg, 'U', 2, 3);

    let line = svg.line(1, 2, 3, 4);
    let id = 'a_unique_id';
    line.attr({ 'id': id });
    let sb = new StraightBondClass(line, b0, b1);
    
    // check getter
    expect(sb.id).toBe(id);

    // check actual value
    expect(sb._line.id()).toBe(id);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

describe('SecondaryBond isAUT method', () => {
  it('works with lowercase characters', () => {
    let svg = createNodeSVG();
    let bu = Base.create(svg, 'u', 4, 5);
    let ba = Base.create(svg, 'a', 3, 5);
    let sbua = SecondaryBond.create(svg, bu, ba);
    expect(sbua.isAUT()).toBeTruthy();
  });

  it('all possible true cases', () => {
    let svg = createNodeSVG();
    let ba = Base.create(svg, 'A', 1, 2);
    let bu = Base.create(svg, 'U', 5, 7);
    let bt = Base.create(svg, 't', 0, 0);
    let sbau = SecondaryBond.create(svg, ba, bu);
    expect(sbau.isAUT()).toBeTruthy();
    let sbat = SecondaryBond.create(svg, ba, bt);
    expect(sbat.isAUT()).toBeTruthy();
    let sbua = SecondaryBond.create(svg, bu, ba);
    expect(sbua.isAUT()).toBeTruthy();
    let sbta = SecondaryBond.create(svg, bt, ba);
    expect(sbta.isAUT()).toBeTruthy();
  });

  it('a false case', () => {
    let svg = createNodeSVG();
    let ba = Base.create(svg, 'A', 1, 5);
    let bc = Base.create(svg, 'C', 1, 5);
    let sbac = SecondaryBond.create(svg, ba, bc);
    expect(sbac.isAUT()).toBeFalsy();
  });
});

describe('SecondaryBond isGC method', () => {
  it('works with lowercase characters', () => {
    let svg = createNodeSVG();
    let bc = Base.create(svg, 'c', 3, 5);
    let bg = Base.create(svg, 'g', 8, 9);
    let sbcg = SecondaryBond.create(svg, bc, bg);
    expect(sbcg.isGC()).toBeTruthy();
  });

  it('all possible true cases', () => {
    let svg = createNodeSVG();
    let bg = Base.create(svg, 'G', 3, 5);
    let bc = Base.create(svg, 'c', 7, 9);
    let sbgc = SecondaryBond.create(svg, bg, bc);
    expect(sbgc.isGC()).toBeTruthy();
    let sbcg = SecondaryBond.create(svg, bc, bg);
    expect(sbcg.isGC()).toBeTruthy();
  });

  it('a false case', () => {
    let svg = createNodeSVG();
    let bg = Base.create(svg, 'G', 4, 5);
    let bu = Base.create(svg, 'U', 1, 2);
    let sbgu = SecondaryBond.create(svg, bg, bu);
    expect(sbgu.isGC()).toBeFalsy();
  });
});

describe('SecondaryBond isGUT method', () => {
  it('works with lowercase characters', () => {
    let svg = createNodeSVG();
    let bu = Base.create(svg, 'u', 5, 5);
    let bg = Base.create(svg, 'g', 3, 4);
    let sbug = SecondaryBond.create(svg, bu, bg);
    expect(sbug.isGUT()).toBeTruthy();
  });

  it('all possible true cases', () => {
    let svg = createNodeSVG();
    let bg = Base.create(svg, 'g', 1, 4);
    let bu = Base.create(svg, 'U', 2, 2);
    let bt = Base.create(svg, 't', 9, 8);
    let sbgu = SecondaryBond.create(svg, bg, bu);
    expect(sbgu.isGUT()).toBeTruthy();
    let sbgt = SecondaryBond.create(svg, bg, bt);
    expect(sbgt.isGUT()).toBeTruthy();
    let sbug = SecondaryBond.create(svg, bu, bg);
    expect(sbug.isGUT()).toBeTruthy();
    let sbtg = SecondaryBond.create(svg, bt, bg);
    expect(sbtg.isGUT()).toBeTruthy();
  });

  it('a false case', () => {
    let svg = createNodeSVG();
    let bu = Base.create(svg, 'U', 2, 5);
    let ba = Base.create(svg, 'A', 2, 5);
    let sbua = SecondaryBond.create(svg, bu, ba);
    expect(sbua.isGUT()).toBeFalsy();
  });
});

it('padding1 getter and setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 40.3, 4.9);
    let b2 = Base.create(svg, 'T', 1, 4);
    let sb = StraightBondClass.create(svg, b1, b2);
    sb.padding1 = 8;
    sb.padding2 = 8;

    let x2 = sb._line.attr('x2');
    let y2 = sb._line.attr('y2');

    sb.padding1 = 0.25;

    // check getter
    expect(sb.padding1).toBeCloseTo(0.25, 6);

    // check actual line coordinates
    checkCoordinates(
      {
        x1: sb._line.attr('x1'),
        y1: sb._line.attr('y1'),
        x2: sb._line.attr('x2'),
        y2: sb._line.attr('y2'),
      },
      {
        x1: 40.05006552984633,
        y1: 4.89427630984381,
        x2: x2,
        y2: y2,
      },
    );

    // updates most recent property
    expect(StraightBondClass.mostRecentProps().padding1).toBeCloseTo(0.25, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('padding2 getter and setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 0.2, -3);
    let b2 = Base.create(svg, 'T', 120.5, 8);
    let sb = StraightBondClass.create(svg, b1, b2);
    sb.padding1 = 8;
    sb.padding2 = 8;

    let x1 = sb._line.attr('x1');
    let y1 = sb._line.attr('y1');

    sb.padding2 = 0.5;

    // check getter
    expect(sb.padding2).toBeCloseTo(0.5, 6);

    // check actual line coordinates
    checkCoordinates(
      {
        x1: sb._line.attr('x1'),
        y1: sb._line.attr('y1'),
        x2: sb._line.attr('x2'),
        y2: sb._line.attr('y2'),
      },
      {
        x1: x1,
        y1: y1,
        x2: 120.00207721370248,
        y2: 7.954470900671049,
      },
    );

    // updates most recent property
    expect(StraightBondClass.mostRecentProps().padding2).toBeCloseTo(0.5, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('reposition method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 0.2, -3);
    let b2 = Base.create(svg, 'T', 120.5, 8);
    let sb = StraightBondClass.create(svg, b1, b2);

    sb.padding1 = 5;
    sb.padding2 = 0.99;

    b1.moveTo(-10, 0.5);
    b2.moveTo(1000, 980.2);

    sb.reposition();

    checkCoordinates(
      {
        x1: sb._line.attr('x1'),
        y1: sb._line.attr('y1'),
        x2: sb._line.attr('x2'),
        y2: sb._line.attr('y2'),
      },
      {
        x1: -6.411041600732329,
        y1: 3.981289647289641,
        x2: 999.289386236945,
        y2: 979.5107046498367,
      },
    );
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('_reposition method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 0.2, -3);
    let b2 = Base.create(svg, 'T', 120.5, 8);
    let sb = StraightBondClass.create(svg, b1, b2);

    b1.moveTo(-10, 0.5);
    b2.moveTo(1000, 980.2);

    sb._reposition(5, 0.99);

    checkCoordinates(
      {
        x1: sb._line.attr('x1'),
        y1: sb._line.attr('y1'),
        x2: sb._line.attr('x2'),
        y2: sb._line.attr('y2'),
      },
      {
        x1: -6.411041600732329,
        y1: 3.981289647289641,
        x2: 999.289386236945,
        y2: 979.5107046498367,
      },
    );
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('_reposition method updates opacity', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'b', 0, 1);
    let b2 = Base.create(svg, 'n', -100.5, -101.6);
    let sb = StraightBondClass.create(svg, b1, b2);

    expect(sb.opacity).toBe(1);
    b1.moveTo(100, 100.5);
    b2.moveTo(200.1, 200.011);
    sb._reposition(1000, 999);
    expect(sb.opacity).toBe(0);

    b1.moveTo(0, 0);
    b2.moveTo(10000, 100009);
    sb._reposition(1000, 999);
    expect(sb.opacity).toBe(1);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('insertBefore method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', -0.445, 0.56);
    let b2 = Base.create(svg, 'T', 1, 2);
    let sb = StraightBondClass.create(svg, b1, b2);

    let circle = svg.circle(100);
    let rect = svg.rect(2);

    expect(sb._line.position()).toBeLessThan(circle.position());
    expect(sb._line.position()).toBeLessThan(rect.position());

    sb.insertBefore(rect);

    expect(sb._line.position()).toBeGreaterThan(circle.position());
    expect(sb._line.position()).toBeLessThan(rect.position());
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('insertAfter method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', -0.445, 0.56);
    let b2 = Base.create(svg, 'T', 1, 2);
    let sb = StraightBondClass.create(svg, b1, b2);

    let circle = svg.circle(100);
    let rect = svg.rect(2);

    expect(sb._line.position()).toBeLessThan(circle.position());
    expect(sb._line.position()).toBeLessThan(rect.position());

    sb.insertAfter(circle);

    expect(sb._line.position()).toBeGreaterThan(circle.position());
    expect(sb._line.position()).toBeLessThan(rect.position());
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('stroke getter and setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 1);
    let b2 = Base.create(svg, 'U', 4, 4);
    let sb = PrimaryBond.create(svg, b1, b2);

    sb.stroke = '#456abc';
    
    // check getter
    expect(sb.stroke).toBe('#456abc');

    // check actual value
    expect(sb._line.attr('stroke')).toBe('#456abc');
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('PrimaryBond stroke setter updates most recent property', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 3, 5);
  let b2 = Base.create(svg, 'j', 1, 1);
  let pb = PrimaryBond.create(svg, b1, b2);
  pb.stroke = '#445566';
  expect(PrimaryBond.mostRecentProps().stroke).toBe('#445566');
});

it('SecondaryBond stroke setter updates most recent property', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'A', 3, 5);
  let bu = Base.create(svg, 'U', 4, 3);
  let bg = Base.create(svg, 'g', 3, 2);
  let bc = Base.create(svg, 'c', 2, 2);
  let bt = Base.create(svg, 't', 5.5, -5.5);

  let sbau = SecondaryBond.create(svg, bu, ba);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bg, bu);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bt, bg);
  let sbOther = SecondaryBond.create(svg, ba, bc);
  
  sbau.stroke = '#123456';
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#123456');
  sbgc.stroke = '#234567';
  expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#234567');
  sbgu.stroke = '#345678';
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#345678');
  sbat.stroke = '#456789';
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#456789');
  sbgt.stroke = '#567890';
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#567890');
  sbOther.stroke = '#678900';
  expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#678900');
});

it('strokeWidth getter and setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 1);
    let b2 = Base.create(svg, 'U', 4, 4);
    let sb = StraightBondClass.create(svg, b1, b2);

    sb.strokeWidth = 2.3;

    // check getter
    expect(sb.strokeWidth).toBeCloseTo(2.3, 6);

    // check actual value
    expect(sb._line.attr('stroke-width')).toBeCloseTo(2.3, 6);

    // updates most recent property
    expect(StraightBondClass.mostRecentProps().strokeWidth).toBeCloseTo(2.3, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('opacity getter and private setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'e', 4, 5);
    let b2 = Base.create(svg, 'r', 1, 4);
    let sb = StraightBondClass.create(svg, b1, b2);

    sb._setOpacity(0.4567);

    // check getter
    expect(sb.opacity).toBeCloseTo(0.4567, 6);

    // check actual value
    expect(sb._line.attr('opacity')).toBeCloseTo(0.4567, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('remove method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1.1, 1.2);
    let b2 = Base.create(svg, 'U', 2.1, 2.2);
    let sb = StraightBondClass.create(svg, b1, b2);
    let lineId = sb._line.id();
    let baseTextId1 = b1._text.id();
    let baseTextId2 = b2._text.id();

    expect(svg.findOne('#' + lineId)).not.toBe(null);
    expect(svg.findOne('#' + baseTextId1)).not.toBe(null);
    expect(svg.findOne('#' + baseTextId2)).not.toBe(null);

    sb.remove();

    expect(svg.findOne('#' + lineId)).toBe(null);

    // does not remove the bases
    expect(svg.findOne('#' + baseTextId1)).not.toBe(null);
    expect(svg.findOne('#' + baseTextId2)).not.toBe(null);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('savableState method all properties except className', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1.1, 1.2);
    let b2 = Base.create(svg, 'U', 2.1, 2.2);
    let sb = StraightBondClass.create(svg, b1, b2);

    let savableState = sb.savableState();
    expect(savableState.line).toBe(sb._line.id());
    expect(savableState.base1).toBe(b1.id);
    expect(savableState.base2).toBe(b2.id);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('PrimaryBond savableState method className property', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1.1, 1.2);
  let b2 = Base.create(svg, 'U', 2.1, 2.2);
  let pb = PrimaryBond.create(svg, b1, b2);
  expect(pb.savableState().className).toBe('PrimaryBond');
});

it('SecondaryBond savableState method className property', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1.1, 1.2);
  let b2 = Base.create(svg, 'U', 2.1, 2.2);
  let sb = SecondaryBond.create(svg, b1, b2);
  expect(sb.savableState().className).toBe('SecondaryBond');
});
