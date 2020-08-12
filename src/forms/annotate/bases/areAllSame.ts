import * as Svg from '@svgdotjs/svg.js';

export function areAllSameNumber(ns: number[]): boolean {
  let allSame = true;
  let n = ns[0];
  if (n == undefined) {
    return true;
  }
  ns.forEach(m => {
    if (m != n) {
      allSame = false;
    }
  });
  return allSame;
}

export function areAllSameColor(cs: Svg.Color[]): boolean {
  let allSame = true;
  let c1 = cs[0];
  if (!c1) {
    return true;
  }
  cs.forEach(c2 => {
    if (c2.toRgb() != c1.toRgb()) {
      allSame = false;
    }
  });
  return allSame;
}
