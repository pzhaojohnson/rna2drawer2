import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';
import {
  positionsWithStretch3,
  stretchOfUnpairedRegion,
  evenOutStretch,
  addStretchEvenly,
} from './stretch';

function createPerBaseProps(size) {
  let props = [];
  for (let i = 0; i < size; i++) {
    props.push(new PerBaseProps());
  }
  return props;
}

describe('positionsWithStretch3 function', () => {
  it("5' bounding position of zero", () => {
    expect(positionsWithStretch3(
      { boundingPosition5: 0, boundingPosition3: 5 }
    )).toStrictEqual(
      [1, 2, 3, 4]
    );
  });

  it("5' bounding position greater than zero", () => {
    expect(positionsWithStretch3(
      { boundingPosition5: 6, boundingPosition3: 10 }
    )).toStrictEqual(
      [6, 7, 8, 9]
    );
  });
});

describe('stretchOfUnpairedRegion function', () => {
  let perBaseProps = createPerBaseProps(6);
  perBaseProps.forEach((props, i) => props.stretch3 = i + 1);

  it("5' bounding position is zero", () => {
    let ur = { boundingPosition5: 0, boundingPosition3: 4 };
    expect(stretchOfUnpairedRegion(perBaseProps, ur)).toBeCloseTo(6);
  });

  it("5' bounding position is greater than zero", () => {
    let ur = { boundingPosition5: 2, boundingPosition3: 5 };
    expect(stretchOfUnpairedRegion(perBaseProps, ur)).toBeCloseTo(9);
  });

  it('unpaired region is out of range', () => {
    let ur = {
      boundingPosition5: perBaseProps.length + 4,
      boundingPosition3: perBaseProps.length + 6,
    };
    expect(stretchOfUnpairedRegion(perBaseProps, ur)).toBe(0);
  });
});

describe('evenOutStretch function', () => {
  it("no positions with 3' stretch", () => {
    let perBaseProps = createPerBaseProps(3);
    let ur = { boundingPosition5: 0, boundingPosition3: 1 };
    evenOutStretch(perBaseProps, ur);
    perBaseProps.forEach(props => {
      expect(Number.isFinite(props.stretch3)).toBeTruthy();
    });
  });

  it("5' bounding position is zero", () => {
    let perBaseProps = createPerBaseProps(6);
    perBaseProps[0].stretch3 = 1;
    perBaseProps[1].stretch3 = 2;
    let ur = { boundingPosition5: 0, boundingPosition3: 3 };
    evenOutStretch(perBaseProps, ur);
    let expected = createPerBaseProps(6);
    expected[0].stretch3 = 1.5;
    expected[1].stretch3 = 1.5;
    expect(perBaseProps).toStrictEqual(expected);
  });

  it("5' bounding position is greater than zero", () => {
    let perBaseProps = createPerBaseProps(8);
    perBaseProps[1].stretch3 = 2;
    perBaseProps[2].stretch3 = 3;
    perBaseProps[3].stretch3 = 4;
    perBaseProps[4].stretch3 = 5;
    let ur = { boundingPosition5: 2, boundingPosition3: 6 };
    evenOutStretch(perBaseProps, ur);
    let expected = createPerBaseProps(8);
    expected[1].stretch3 = 3.5;
    expected[2].stretch3 = 3.5;
    expected[3].stretch3 = 3.5;
    expected[4].stretch3 = 3.5;
    expect(perBaseProps).toStrictEqual(expected);
  });

  it('unpaired region is out of range', () => {
    let perBaseProps = createPerBaseProps(6);
    let ur = { boundingPosition5: 10, boundingPosition3: 12 };
    evenOutStretch(perBaseProps, ur);
    for (let i = 0; i < 12; i++) {
      let props = perBaseProps[i];
      if (props) {
        expect(Number.isFinite(props.stretch3)).toBeTruthy();
      }
    }
  });
});

describe('addStretchEvenly function', () => {
  it("no positions with 3' stretch", () => {
    let perBaseProps = createPerBaseProps(5);
    let ur = { boundingPosition5: 0, boundingPosition3: 1 };
    addStretchEvenly(perBaseProps, ur, 6);
    perBaseProps.forEach(props => {
      expect(props.stretch3).toBe(0);
    });
  });

  it("5' bounding position is zero", () => {
    let perBaseProps = createPerBaseProps(9);
    let ur = { boundingPosition5: 0, boundingPosition3: 4 };
    perBaseProps[1].stretch3 = 3; // preexisting stretch
    addStretchEvenly(perBaseProps, ur, 6);
    let expected = createPerBaseProps(9);
    expected[0].stretch3 = 2;
    expected[1].stretch3 = 5;
    expected[2].stretch3 = 2;
    expect(perBaseProps).toStrictEqual(expected);
  });

  it("5' bounding position is greater than zero", () => {
    let perBaseProps = createPerBaseProps(11);
    let ur = { boundingPosition5: 2, boundingPosition3: 4 };
    perBaseProps[1].stretch3 = 1.5; // preexisting stretch
    addStretchEvenly(perBaseProps, ur, 8);
    let expected = createPerBaseProps(11);
    expected[1].stretch3 = 5.5;
    expected[2].stretch3 = 4;
    expect(perBaseProps).toStrictEqual(expected);
  });

  it('unpaired region is out of range', () => {
    let perBaseProps = createPerBaseProps(3);
    let ur = { boundingPosition5: 6, boundingPosition3: 9 };
    addStretchEvenly(perBaseProps, ur, 3);
    let expected = createPerBaseProps(3);
    for (let p = 6; p < 9; p++) {
      expected[p - 1] = new PerBaseProps();
      expected[p - 1].stretch3 = 1;
    }
    expect(perBaseProps).toStrictEqual(expected);
  });
});
