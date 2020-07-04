import { render, unmountComponentAtNode } from 'react-dom';
import EditBaseNumbering from './EditBaseNumbering';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('create static method', () => {
  it('close callback closes form', () => {
    let app = new App(() => NodeSVG());
    let ele = EditBaseNumbering.create(app);
    let spy = jest.spyOn(app, 'unmountCurrForm');
    ele.props.close();
    expect(spy).toHaveBeenCalled();
  });
});

describe('render method', () => {
  it('passes close callback', () => {
    let close = jest.fn();
    let comp = new EditBaseNumbering({ close: close });
    let ele = comp.render();
    expect(close).not.toHaveBeenCalled();
    ele.props.close();
    expect(close).toHaveBeenCalled();
  });
});
