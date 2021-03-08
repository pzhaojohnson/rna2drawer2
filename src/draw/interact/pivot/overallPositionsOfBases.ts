import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/BaseInterface';

export function overallPositionsOfBases(drawing: Drawing, bases: Base[]): Set<number> {
  let baseIds = new Set<string>();
  bases.forEach(b => baseIds.add(b.id));

  let ps = new Set<number>();
  drawing.forEachBase((b, p) => {
    if (baseIds.has(b.id)) {
      ps.add(p);
    }
  });
  return ps;
}
