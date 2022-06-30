import { parseSequence } from '../../parse/parseSequence';
import {
  parseDotBracket,
  ParsedDotBracket,
  lastUnmatchedUpPartner,
  lastUnmatchedDownPartner,
} from '../../parse/parseDotBracket';

interface Inputs {
  sequenceId: string;

  sequence: string;
  ignoreNumbers: boolean;
  ignoreNonAugctLetters: boolean;
  ignoreNonAlphanumerics: boolean;

  dotBracket: string;
}

interface Structure {
  id: string;
  sequence: string;
  secondaryPartners?: (number | null)[];
  tertiaryPartners?: (number | null)[];
}

function parsePartners(dotBracket: string): ParsedDotBracket | string {
  let parsed = parseDotBracket(dotBracket);
  if (parsed) {
    return parsed;
  }
  let uup = lastUnmatchedUpPartner(dotBracket);
  if (uup) {
    return 'Unmatched "' + uup + '" in structure.';
  }
  let udp = lastUnmatchedDownPartner(dotBracket);
  if (udp) {
    return 'Unmatched "' + udp + '" in structure.';
  }
  return 'Invalid structure.';
}

/**
 * Returns an error message as a string for invalid inputs.
 */
export function parseInputs(inputs: Inputs): Structure | string {
  let sequenceId = inputs.sequenceId.trim();
  if (sequenceId.length == 0) {
    return 'Specify a sequence ID.';
  }
  let sequence = parseSequence(inputs.sequence, {
    ignoreNumbers: inputs.ignoreNumbers,
    ignoreNonAUGCTLetters: inputs.ignoreNonAugctLetters,
    ignoreNonAlphanumerics: inputs.ignoreNonAlphanumerics,
  });
  if (sequence.length == 0) {
    if (inputs.sequence.trim().length > 0) {
      return 'Sequence has only ignored characters.';
    }
    return 'Sequence is empty.';
  }
  let partners = parsePartners(inputs.dotBracket);
  if (typeof partners == 'string') {
    return partners;
  }
  let { secondaryPartners, tertiaryPartners } = partners;
  if (secondaryPartners.length > 0 && secondaryPartners.length != sequence.length) {
    return 'Sequence and structure are different lengths.';
  }
  return {
    id: sequenceId,
    sequence: sequence,
    secondaryPartners: secondaryPartners.length > 0 ? secondaryPartners : undefined,
    tertiaryPartners: tertiaryPartners.length > 0 ? tertiaryPartners : undefined,
  };
}
