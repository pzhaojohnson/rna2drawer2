import { handleMouseoverOnBase } from './handlers';
import App from '../../../App';
import NodeSVG from '../../NodeSVG';

let app = new App(() => NodeSVG());
app.strictDrawing.appendSequence('asdf', 'asdfasdfasdfasdf');
app.strictDrawingInteraction.startAnnotating();
let mode = app.strictDrawingInteraction.annotatingMode;

describe('handleMouseoverOnBase function', () => {
  describe('selecting positions from last clicked position', () => {
    it('when hovered is greater than last clicked position', () => {
      mode.selected = new Set();
      mode.selected.add(8);
      mode.selectingFrom = 8;
      mode.hovered = 12;
      let b = app.strictDrawing.drawing.getBaseAtOverallPosition(12);
      handleMouseoverOnBase(mode, b);
      for (let p = 8; p <= 12; p++) {
        expect(mode.selected.has(p)).toBeTruthy();
      }
    });

    it('when hovered is less than last clicked position', () => {
      mode.selected = new Set();
      mode.selected.add(11);
      mode.selectingFrom = 11;
      mode.hovered = 5;
      let b = app.strictDrawing.drawing.getBaseAtOverallPosition(5);
      handleMouseoverOnBase(mode, b);
      for (let p = 5; p <= 11; p++) {
        expect(mode.selected.has(p)).toBeTruthy();
      }
    });
  });
});
