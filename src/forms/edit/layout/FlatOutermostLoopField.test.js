import FlatOutermostLoopField from './FlatOutermostLoopField';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

describe('create static method', () => {
  it('passes whether has a flat outermost loop', () => {
    let app = new App(() => NodeSVG());
    app.strictDrawing.flatOutermostLoop();
    let ele = FlatOutermostLoopField.create(app);
    expect(ele.props.hasFlatOutermostLoop).toBeTruthy();
    app.strictDrawing.roundOutermostLoop();
    ele = FlatOutermostLoopField.create(app);
    expect(ele.props.hasFlatOutermostLoop).toBeFalsy();
  });

  describe('set callback', () => {
    it('can make outermost loop flat', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.roundOutermostLoop();
      let ele = FlatOutermostLoopField.create(app);
      let spy = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.set(true);
      // makes outermost loop flat
      expect(app.strictDrawing.hasFlatOutermostLoop()).toBeTruthy();
      expect(spy).toHaveBeenCalled(); // refreshes field
      app.undo();
      expect(app.strictDrawing.hasRoundOutermostLoop()).toBeTruthy(); // pushes undo
    });

    it('can make outermost loop round', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.flatOutermostLoop();
      let ele = FlatOutermostLoopField.create(app);
      let spy = jest.spyOn(app, 'drawingChangedNotByInteraction');
      ele.props.set(false);
      // makes outermost loop round
      expect(app.strictDrawing.hasRoundOutermostLoop()).toBeTruthy();
      expect(spy).toHaveBeenCalled(); // refreshes field
      app.undo();
      expect(app.strictDrawing.hasFlatOutermostLoop()).toBeTruthy(); // pushes undo
    });

    it('has no effect if making a flat outermost loop flat', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.flatOutermostLoop();
      let ele = FlatOutermostLoopField.create(app);
      let spy = jest.spyOn(app, 'pushUndo');
      ele.props.set(true);
      // does not change outermost loop shape
      expect(app.strictDrawing.hasFlatOutermostLoop()).toBeTruthy();
      expect(spy).not.toHaveBeenCalled(); // does not push undo
    });

    it('has no effect if making a round outermost loop round', () => {
      let app = new App(() => NodeSVG());
      app.strictDrawing.roundOutermostLoop();
      let ele = FlatOutermostLoopField.create(app);
      let spy = jest.spyOn(app, 'pushUndo');
      ele.props.set(false);
      // does not change outermost loop shape
      expect(app.strictDrawing.hasRoundOutermostLoop()).toBeTruthy();
      expect(spy).not.toHaveBeenCalled(); // does not push undo
    });
  });
});

describe('render method', () => {
  it('indicates whether has a flat outermost loop', () => {
    let comp = new FlatOutermostLoopField({ hasFlatOutermostLoop: true });
    let ele = comp.render();
    expect(ele.props.initialValue).toBe(true);

    comp = new FlatOutermostLoopField({ hasFlatOutermostLoop: false });
    ele = comp.render();
    expect(ele.props.initialValue).toBe(false);
  });

  it('passes value between set callbacks', () => {
    let set = jest.fn();
    let comp = new FlatOutermostLoopField({ hasFlatOutermostLoop: false, set: set });
    let ele = comp.render();
    ele.props.set(true);
    expect(set.mock.calls[0][0]).toBe(true);
    ele.props.set(false);
    expect(set.mock.calls[1][0]).toBe(false);
  });
});
