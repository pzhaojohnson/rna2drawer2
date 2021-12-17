import { normalizedMagnitudeOfMovement } from './movement';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { setZoom } from 'Draw/zoom';
import { resize } from 'Draw/dimensions';

let app = new App({ SVG: { SVG: NodeSVG } });
app.strictDrawing.appendSequence('asdf', 'asdfasdf');

describe('normalizedMagnitudeOfMovement function', () => {
  it('zoom might be zero', () => {
    resize(app.strictDrawing.drawing, { width: 0, height: 0 });
    let m = normalizedMagnitudeOfMovement(
      app.strictDrawingInteraction.pivotingMode,
      { x: 2, y: 2 },
    );
    expect(Number.isFinite(m)).toBeTruthy();
  });

  it('zoom is greater than zero', () => {
    resize(app.strictDrawing.drawing, { width: 300, height: 200 });
    setZoom(app.strictDrawing.drawing, 2);
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
