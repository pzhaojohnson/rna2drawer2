import type { Point2D as Point } from 'Math/points/Point';

type Displacement = {
  magnitude: number;
  direction: number;
};

function displacePoint(p: Point, d: Displacement): Point {
  return {
    x: p.x + (d.magnitude * Math.cos(d.direction)),
    y: p.y + (d.magnitude * Math.sin(d.direction)),
  };
}

export type RectangleSpecification = {
  width: number;
  height: number;
  borderRadius: number;
  rotation: number;
  center: Point;
};

export function createRectanglePathString(spec: RectangleSpecification): string {
  // make sure border radius is not too big
  let borderRadius = Math.min(
    spec.borderRadius,
    spec.width / 2,
    spec.height / 2,
  );
  // ensure border radius is not negative
  borderRadius = Math.max(borderRadius, 0);

  let d = '';

  let p = spec.center;
  p = displacePoint(p, {
    magnitude: spec.height / 2,
    direction: spec.rotation - (Math.PI / 2),
  });
  p = displacePoint(p, {
    magnitude: (spec.width / 2) - borderRadius,
    direction: spec.rotation,
  });
  d += `M ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: Math.SQRT2 * borderRadius,
    direction: spec.rotation + (Math.PI / 4),
  });
  d += ` A ${borderRadius} ${borderRadius} 90 0 1 ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: spec.height - (2 * borderRadius),
    direction: spec.rotation + (Math.PI / 2),
  });
  d += ` L ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: Math.SQRT2 * borderRadius,
    direction: spec.rotation + (3 * Math.PI / 4),
  });
  d += ` A ${borderRadius} ${borderRadius} 90 0 1 ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: spec.width - (2 * borderRadius),
    direction: spec.rotation + Math.PI,
  });
  d += ` L ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: Math.SQRT2 * borderRadius,
    direction: spec.rotation + (5 * Math.PI / 4),
  });
  d += ` A ${borderRadius} ${borderRadius} 90 0 1 ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: spec.height - (2 * borderRadius),
    direction: spec.rotation - (Math.PI / 2),
  });
  d += ` L ${p.x} ${p.y}`;

  p = displacePoint(p, {
    magnitude: Math.SQRT2 * borderRadius,
    direction: spec.rotation + (7 * Math.PI / 4),
  });
  d += ` A ${borderRadius} ${borderRadius} 90 0 1 ${p.x} ${p.y}`;

  d += ' Z';

  return d;
}
