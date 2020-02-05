import secondaryAndTertiaryPartners from './secondaryAndTertiaryPartners';
import validatePartners from './validatePartners';

let cases = [
  {
    partners: [],
    secondary
  }
];

it('secondaryAndTertiaryPartners', () => {
  cases.forEach(cs => {

    // validate manually typed in partners notation
    validatePartners(cs.partners);


  });
});
