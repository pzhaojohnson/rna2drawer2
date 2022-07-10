import { PartnersWrapper } from './PartnersWrapper';

describe('PartnersWrapper class', () => {
  test('constructor and partners property', () => {
    let partnersArray = [undefined, 6, null, null, undefined, 2];

    // from a partners array
    let partners = new PartnersWrapper(partnersArray);
    expect(partners.partners).toBe(partnersArray);

    // from another partners wrapper
    partners = new PartnersWrapper(new PartnersWrapper(partnersArray));
    expect(partners.partners).toBe(partnersArray);
  });

  test('partnerOf method', () => {
    let partnersArray = [null, 5, undefined, undefined, 2, undefined];
    let partners = new PartnersWrapper(partnersArray);
    expect(partners.partnerOf(1)).toBe(null);
    expect(partners.partnerOf(2)).toBe(5);
    expect(partners.partnerOf(4)).toBeUndefined();
  });

  test('length getter', () => {
    let partnersArray = [undefined, null, undefined, null, null, null, null];
    let partners = new PartnersWrapper(partnersArray);
    expect(partners.length).toBe(7);
  });
});
