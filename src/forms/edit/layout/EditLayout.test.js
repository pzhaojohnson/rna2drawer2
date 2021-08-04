import EditLayout from './EditLayout';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

describe('create static method', () => {
  it('only creates termini gap field if has round outermost loop', () => {
    let app = new App(() => NodeSVG());
    app.strictDrawing.roundOutermostLoop();
    let ele = EditLayout.create(app);
    expect(ele.props.terminiGapField).toBeTruthy();
    app.strictDrawing.flatOutermostLoop();
    ele = EditLayout.create(app);
    expect(ele.props.terminiGapField).toBeFalsy();
  });

  it('close callback unmounts form', () => {
    let app = new App(() => NodeSVG());
    let ele = EditLayout.create(app);
    let spy = jest.spyOn(app, 'unmountCurrForm');
    ele.props.close();
    expect(spy).toHaveBeenCalled();
  });
});

describe('render method', () => {
  it('passes close callback', () => {
    let close = jest.fn();
    let comp = new EditLayout({ close: close });
    let ele = comp.render();
    expect(close).not.toHaveBeenCalled();
    ele.props.close();
    expect(close).toHaveBeenCalled();
  });
});
