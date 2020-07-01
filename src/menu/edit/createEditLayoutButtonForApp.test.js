import createEditLayoutButtonForApp from './createEditLayoutButtonForApp';

jest.mock('../../forms/edit/layout/renderEditLayoutInApp');
import renderEditLayoutInApp from '../../forms/edit/layout/renderEditLayoutInApp';

let app = {};

describe('createEditLayoutButtonForApp function', () => {
  renderEditLayoutInApp.mockImplementation(() => {});
  let elb = createEditLayoutButtonForApp(app);

  it('passes a key', () => {
    expect(elb.key).toBeTruthy();
  });

  it('passes text', () => {
    expect(elb.props.text).toBe('Layout');
  });

  it('passes onClick callback', () => {
    elb.props.onClick();
    expect(renderEditLayoutInApp.mock.calls[0][0]).toBe(app);
  });
});
