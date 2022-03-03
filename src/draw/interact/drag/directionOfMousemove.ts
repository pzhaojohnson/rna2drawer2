import { direction2D as direction } from 'Math/points/direction';

// returns the angle that is the direction of a mouse movement
export function directionOfMousemove(event: MouseEvent): number {
  return direction({ x: event.movementX, y: event.movementY });
}
