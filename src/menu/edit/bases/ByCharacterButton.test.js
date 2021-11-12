import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { ByCharacterButton } from './ByCharacterButton';
import { BasesByCharacter } from 'Forms/edit/bases/by/character/BasesByCharacter';

it('onClick callback opens form', () => {
  let app = new App(() => NodeSVG());
  let b = ByCharacterButton({ app: app });
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  expect(spy.mock.calls[0][0]().type).toBe(BasesByCharacter);
});
