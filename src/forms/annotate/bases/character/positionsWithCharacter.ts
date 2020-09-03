import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';

export function positionsWithCharacter(drawing: Drawing, c: string): number[] {
  let ps = [] as number[];
  drawing.forEachBase((b, p) => {
    if (b.character == c) {
      ps.push(p);
    }
  });
  return ps;
}
