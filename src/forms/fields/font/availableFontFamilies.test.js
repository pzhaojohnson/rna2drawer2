import { availableFontFamilies } from './availableFontFamilies';

test('availableFontFamilies function', () => {
  // give time for font families to load
  setTimeout(
    () => {
      let ffs = availableFontFamilies();

      // should include at least some font families
      expect(ffs.length).toBeGreaterThanOrEqual(5);
      expect(ffs.includes('Times New Roman')).toBeTruthy();
      expect(ffs.includes('Arial')).toBeTruthy();
      expect(ffs.includes('Courier New')).toBeTruthy();
    },
    1000,
  );
});
