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

export type TriangleSpecification = {
  width: number;
  height: number;
  tailsHeight: number;
  rotation: number;
  center: Point;
};

export function createTrianglePathString(spec: TriangleSpecification): string {
  // tails height cannot be greater than the total height
  let tailsHeight = Math.min(spec.tailsHeight, spec.height);

  let topPoint = displacePoint(spec.center, {
    magnitude: spec.height / 2,
    direction: spec.rotation - (Math.PI / 2),
  });

  let bottomLeftPoint = displacePoint(spec.center, {
    magnitude: spec.width / 2,
    direction: spec.rotation + Math.PI,
  });
  bottomLeftPoint = displacePoint(bottomLeftPoint, {
    magnitude: spec.height / 2,
    direction: spec.rotation + (Math.PI / 2),
  });

  let bottomRightPoint = displacePoint(spec.center, {
    magnitude: spec.width / 2,
    direction: spec.rotation,
  });
  bottomRightPoint = displacePoint(bottomRightPoint, {
    magnitude: spec.height / 2,
    direction: spec.rotation + (Math.PI / 2),
  });

  let baseMidpoint = displacePoint(spec.center, {
    magnitude: (spec.height / 2) - tailsHeight,
    direction: spec.rotation + (Math.PI / 2),
  });

  let d = `M ${topPoint.x} ${topPoint.y}`
  d += ` L ${bottomRightPoint.x} ${bottomRightPoint.y}`
  d += ` L ${baseMidpoint.x} ${baseMidpoint.y}`
  d += ` L ${bottomLeftPoint.x} ${bottomLeftPoint.y}`
  d += ' Z';
  return d;
}
