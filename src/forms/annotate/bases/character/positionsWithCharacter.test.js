import App from '../../../../App';
import NodeSVG from '../../../../draw/NodeSVG';
import { positionsWithCharacter } from './positionsWithCharacter';

it('handles multiple sequences', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'AUGCAAGC');
  app.strictDrawing.appendSequence('qwer', 'GUCACCU');
  let ps = positionsWithCharacter(app.strictDrawing.drawing, 'C');
  expect(ps).toStrictEqual([4, 8, 11, 13, 14]);
});
