import { normalizedMagnitudeOfMovement } from './movement';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

let app = new App(() => NodeSVG());
app.strictDrawing.appendSequence('asdf', 'asdfasdf');

describe('normalizedMagnitudeOfMovement function', () => {
  it('zoom is zero', () => {
    let mode = {
      strictDrawing: {
        drawing: {
          zoom: 0, // could cause division by zero
        },
        baseWidth: 12,
        baseHeight: 12,
      },
    };
    expect(normalizedMagnitudeOfMovement(mode, { x: 2, y: 2 })).toBe(0);
  });

  it('zoom is greater than zero', () => {
    app.strictDrawing.drawing.zoom = 2;
    app.strictDrawing.baseWidth = 15;
    app.strictDrawing.baseHeight = 25;
    expect(
      normalizedMagnitudeOfMovement(
        app.strictDrawingInteraction.pivotingMode,
        { x: 3, y: 4 },
      )
    ).toBeCloseTo(0.0625);
  });
});
