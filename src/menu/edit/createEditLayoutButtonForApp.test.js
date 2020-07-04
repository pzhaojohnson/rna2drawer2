import createEditLayoutButtonForApp from './createEditLayoutButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import EditLayout from '../../forms/edit/layout/EditLayout';

describe('createEditLayoutButtonForApp function', () => {
  let app = new App(() => NodeSVG());
  let elb = createEditLayoutButtonForApp(app);

  it('passes a key', () => {
    expect(elb.key).toBeTruthy();
  });

  it('passes text', () => {
    expect(elb.props.text).toBe('Layout');
  });

  it('onClick callback opens form', () => {
    let spy = jest.spyOn(app, 'renderForm');
    elb.props.onClick();
    let factory = spy.mock.calls[0][0];
    expect(factory().type).toBe(EditLayout);
  });
});
