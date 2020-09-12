import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';
import { resetStemProps, copyStemProps } from './stemProps';

describe('resetStemProps function', () => {
  it('stem is in range', () => {
    let perBaseProps = [];
    for (let i = 0; i < 20; i++) {
      perBaseProps.push(new PerBaseProps());
    }
    let st = { position5: 6, position3: 19, size: 3 };
    let defaults = new PerBaseProps();
    perBaseProps[5].flipStem = !defaults.flipStem;
    perBaseProps[5].loopShape = 'triangle';
    expect(defaults.loopShape).not.toBe('triangle');
    perBaseProps[5].triangleLoopHeight = defaults.triangleLoopHeight + 112;
    resetStemProps(perBaseProps, st);
    expect(perBaseProps[5].flipStem).toBe(defaults.flipStem);
    expect(perBaseProps[5].loopShape).toBe(defaults.loopShape);
    expect(perBaseProps[5].triangleLoopHeight).toBe(defaults.triangleLoopHeight);
  });

  it('stem is out of range', () => {
    expect(
      () => resetStemProps([], { position5: 2, position3: 10, size: 2 })
    ).not.toThrow();
  });
});

describe('copyStemProps function', () => {
  function createPerBaseProps() {
    let perBaseProps = [];
    for (let i = 0; i < 24; i++) {
      perBaseProps.push(new PerBaseProps());
    }
    return perBaseProps;
  }

  it('the from and to stems are in range', () => {
    let perBaseProps = createPerBaseProps();
    let fromStem = { position5: 2, position3: 9, size: 2 };
    let toStem = { position5: 12, position3: 20, size: 3 };
    perBaseProps[1].flipStem = !perBaseProps[11].flipStem;
    perBaseProps[1].loopShape = 'triangle';
    expect(perBaseProps[11].loopShape).not.toBe('triangle');
    perBaseProps[1].triangleLoopHeight = perBaseProps[11].triangleLoopHeight + 12.3;
    copyStemProps(perBaseProps, fromStem, toStem);
    expect(perBaseProps[11].flipStem).toBe(perBaseProps[1].flipStem);
    expect(perBaseProps[11].loopShape).toBe(perBaseProps[1].loopShape);
    expect(perBaseProps[11].triangleLoopHeight).toBe(perBaseProps[1].triangleLoopHeight);
  });

  it('the from stem is out of range', () => {
    let perBaseProps = createPerBaseProps();
    let fromStem = { position5: 42, position3: 54, size: 3 };
    let toStem = { position5: 5, position3: 12, size: 2 };
    expect(fromStem.position5).toBeGreaterThan(perBaseProps.length);
    expect(toStem.position5).toBeLessThanOrEqual(perBaseProps.length);
    expect(
      () => copyStemProps(perBaseProps, fromStem, toStem)
    ).not.toThrow();
  });

  it('the to stem is out of range', () => {
    let perBaseProps = createPerBaseProps();
    let fromStem = { position5: 5, position3: 12, size: 2 };
    let toStem = { position5: 42, position3: 54, size: 3 };
    expect(fromStem.position5).toBeLessThanOrEqual(perBaseProps.length);
    expect(toStem.position5).toBeGreaterThan(perBaseProps.length);
    expect(
      () => copyStemProps(perBaseProps, fromStem, toStem)
    ).not.toThrow();
  });
});
