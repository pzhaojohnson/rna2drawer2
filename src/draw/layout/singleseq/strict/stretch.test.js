import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';
import { stretchOfUnpairedRegion, evenOutStretch } from './stretch';

describe('stretchOfUnpairedRegion function', () => {
  let perBaseProps = [];
  for (let i = 0; i < 6; i++) {
    let props = new PerBaseProps();
    props.stretch3 = i + 1;
    perBaseProps.push(props);
  }

  it("5' bounding position of zero", () => {
    let ur = { boundingPosition5: 0, boundingPosition3: 4 };
    expect(stretchOfUnpairedRegion(perBaseProps, ur)).toBeCloseTo(6);
  });

  it("5' bounding position greater than zero", () => {
    let ur = { boundingPosition5: 2, boundingPosition3: 5 };
    expect(stretchOfUnpairedRegion(perBaseProps, ur)).toBeCloseTo(9);
  });

  it('unpaired region is out of range', () => {
    let ur = { boundingPosition5: 10, boundingPosition3: 12 };
    expect(stretchOfUnpairedRegion(perBaseProps, ur)).toBe(0);
  });
});

describe('evenOutStretch function', () => {
  function createPerBaseProps() {
    let perBaseProps = [];
    for (let i = 0; i < 6; i++) {
      let props = new PerBaseProps();
      props.stretch3 = i + 1;
      perBaseProps.push(props);
    }
    return perBaseProps;
  }

  it("5' bounding position and size are greater than zero", () => {
    let perBaseProps = createPerBaseProps();
    let ur = { boundingPosition5: 2, boundingPosition3: 6 };
    evenOutStretch(perBaseProps, ur);
    let expected = createPerBaseProps();
    expected[1].stretch3 = 3.5;
    expected[2].stretch3 = 3.5;
    expected[3].stretch3 = 3.5;
    expected[4].stretch3 = 3.5;
    expect(perBaseProps).toStrictEqual(expected);
  });

  it("5' bounding position is zero and size is greater than zero", () => {
    let perBaseProps = createPerBaseProps();
    let ur = { boundingPosition5: 0, boundingPosition3: 5 };
    evenOutStretch(perBaseProps, ur);
    let expected = createPerBaseProps();
    expected[0].stretch3 = 2.5;
    expected[1].stretch3 = 2.5;
    expected[2].stretch3 = 2.5;
    expected[3].stretch3 = 2.5;
    expect(perBaseProps).toStrictEqual(expected);
  });

  it("5' bounding position and size are zero", () => {
    let perBaseProps = createPerBaseProps();
    let ur = { boundingPosition5: 0, boundingPosition3: 1 };
    evenOutStretch(perBaseProps, ur);
    expect(perBaseProps).toStrictEqual(createPerBaseProps());
  });

  it('unpaired region is out of range', () => {
    let perBaseProps = createPerBaseProps();
    let ur = { boundingPosition5: 10, boundingPosition3: 12 };
    evenOutStretch(perBaseProps, ur);
    expect(perBaseProps).toStrictEqual(createPerBaseProps());
  });
});
