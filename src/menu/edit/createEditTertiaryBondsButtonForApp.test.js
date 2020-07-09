import createEditTertiaryBondsButtonForApp from './createEditTertiaryBondsButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import EditTertiaryBond from '../../forms/edit/tertiaryBonds/EditTertiaryBond';

describe('createEditLayoutButtonForApp function', () => {
  let app = new App(() => NodeSVG());
  let b = createEditTertiaryBondsButtonForApp(app);

  it('passes a key', () => {
    expect(b.key).toBeTruthy();
  });

  it('passes text', () => {
    expect(b.props.text).toBe('Tertiary Bonds');
  });

  it('onClick callback opens form', () => {
    let spy = jest.spyOn(app, 'renderForm');
    b.props.onClick();
    let factory = spy.mock.calls[0][0];
    expect(factory().type).toBe(EditTertiaryBond);
  });
});
