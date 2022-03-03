import { StrictLayout } from 'Draw/strict/layout/StrictLayout';
import { StrictLayoutSpecification } from './StrictLayoutSpecification';

// attempts to create a strict layout from the given specification
// and returns undefined if unable to do so
export function createStrictLayout(spec: StrictLayoutSpecification): StrictLayout | undefined {
  try {
    return new StrictLayout(
      spec.partners,
      spec.generalProps,
      spec.perBasePropsArray,
    );
  } catch (error) {
    console.error(error);
    console.error('Unable to create strict layout.');
    return undefined;
  }
}
