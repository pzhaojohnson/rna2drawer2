import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../AppInterface';
import { UnclosableFlexContainer } from '../containers/UnclosableFlexContainer';
import { ExampleSelect } from './ExampleSelect';
import { SequenceIdField } from './SequenceIdField';
import { SequenceField } from './SequenceField';
import { SequenceParsingDetails } from './SequenceParsingDetails';
import { DotBracketField } from './DotBracketField';
import { DotBracketParsingDetails } from './DotBracketParsingDetails';
import { ActionButton } from '../buttons/ActionButton';
import { parseInputs } from './parseInputs';

let examples = [
  {
    name: '--- None ---',
    sequenceId: '',
    sequence: '',
    dotBracket: '',
  },
  {
    name: 'A Small Structure',
    sequenceId: 'A Small Structure',
    sequence: 'UAAGCGCAUAGACGAUGCAACCGCAUCGCCUAGCGCUUAGAUCGGCCAACAGCAUCGGUUGGCCAAUAGGCUGCACGCCAUCAUUUGCAUGGUGUGUAAAGCUU',
    dotBracket:'...((((.....((((((....))))))....)))).......(((((((.......))))))).......(((((((((.........)))))))))......',
  },
  {
    name: 'A Big Structure',
    sequenceId: 'A Big Structure',
    sequence: 'GCCGCUAUAACAAUACUAGAUGGAAUUUCACAGUAUUCACUGAGACUCAUUGAUGCUAUGAUGUUCACAUCUGAUUUGGCUACUAACAAUCUAGUUGUAAUGGCCUACAUUACAGGUGGUGUUGUUCAGUUGACUUCGCAGUGGCUAACUAACAUCUUUGGCACUGUUUAUGAAAAACUCAAACCCGUCCUUGAUUGGCUUGAAGAGAAGUUUAAGGAAGGUGUAGAGUUUCUUAGAGACGGUUGGGAAAUUGUUAAAUUUAUCUCAACCUGUGCUUGUGAAAUUGUCGGUGGACAAAUUGUCACCUGUGCAAAGGAAAUUAAGGAGAGUGUUCAGACAUUCUUUAAGCUUGUAAAUAAAUUUUUGGCUUUGUGUGCUGACUCUAUCAUUAUUGGUGGAGCUAAACUUAAAGCCUUGAAUUUAGGUGAAACAUUUGUCACGCACUCAAAGGGAUUGUACAGAAAGUGUGUUAAAUCCAGAGAAGAAACUGGCCUACUCAUGCCUCUAAAAGCCCCAAAAGAAAUUAUCUUCUUAGAGGGA',
    dotBracket: '((((((..........((((((((((.(((.(((((.((.((.....)).))))))).))).)))).))))))..(..(((...(((((((((.((((((((.....)))))))).))).)))))).)))..)......))))))..((..(((((...(((((.((((.(((.((((((..(((..(((((((...((((......))))))))))).)))...)))))).))).))))((((((((((((....))))..)))))))).)))))...))...)))..)).(((((((..(((((.................(((((((((....)))))))))...........(((((((..(((((((.((..((.((((((((....)))))))).)).)).)))))))..))))))))))))...))))))).....(((...(((..(....(((..(((((......((((........))))......))))).)))...)..)))..(((((......))))).)))...',
  },
  {
    name: 'Pseudoknots',
    sequenceId: 'Pseudoknots',
    sequence: 'UUUUAUAGAAACCAUCUCACUUGCUGGUUCCUAUAAAGAUUGGUCCUAUUCUGGACAAUCUACACAACUAGGUAUAGAAUCUGGUAAGAGAGGUGAUAAAAGUGUAUAUUACACUAGUAAUCCUACCACAUUCCACCUAGAUGGUGAAGUUAUCACCUUUGACAAUCUUAAGACACUUCUUUCUUUGAGAGAAGUGAGGACUAUUAAGGUGUUUAAAACAGUAGACAACAUUAACCUCCACACUGUUGUUGUGGACACCAUGUCAAUGACAUAUGGACAUGGUGUUGGUCCAACUUAUUUGGAUG',
    dotBracket: '...[[[[[...((((....((((.((((((]]]]].((((((((((......))))..((((.((......)).))))...{{{{{..(((((((((((.((((((...))))))........}}}}}.....((((.....))))...)))))))))))..)))))).....((((((((((...)))))))))).)))))).)))).((((((......)))))).((((.((.((((((.......))))))<<<<<.)).))))....))))...>>>>>...((((((.....)))))).',
  },
];

interface Props {
  app: App;
  close: () => void;
}

export function CreateNewDrawing(props: Props): React.ReactElement {
  let e0 = examples[0];
  let [example, setExample] = useState(e0 ? e0.name : '');
  let [sequenceId, setSequenceId] = useState(e0 ? e0.sequenceId : '');
  let [sequence, setSequence] = useState(e0 ? e0.sequence : '');
  let [dotBracket, setDotBracket] = useState(e0 ? e0.dotBracket : '');

  let [showingSequenceParsingDetails, showSequenceParsingDetails] = useState(false);
  let [ignoringNumbers, ignoreNumbers] = useState(true);
  let [ignoringNonAugctLetters, ignoreNonAugctLetters] = useState(false);
  let [ignoringNonAlphanumerics, ignoreNonAlphanumerics] = useState(true);

  let [showingDotBracketParsingDetails, showDotBracketParsingDetails] = useState(false);

  let [errorMessage, setErrorMessage] = useState('');
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  return (
    <UnclosableFlexContainer
      title={'Create a New Drawing'}
      contained={
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
          <ExampleSelect
            examples={examples.map(e => e.name)}
            selected={example}
            select={name => {
              let example = examples.find(e => e.name == name);
              if (example) {
                setExample(name);
                setSequenceId(example.sequenceId);
                setSequence(example.sequence);
                setDotBracket(example.dotBracket);
                setErrorMessage('');
              }
            }}
          />
          <div style={{ marginTop: '16px' }} >
            <SequenceIdField
              initialValue={sequenceId}
              set={id => setSequenceId(id)}
            />
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
            <div style={{ flexBasis: '0px', flexGrow: 1, display: 'flex', flexDirection: 'row' }} >
              <SequenceField
                initialValue={sequence}
                set={s => setSequence(s)}
                toggleParsingDetails={() => showSequenceParsingDetails(!showingSequenceParsingDetails)}
                flexGrow={1}
              />
              {!showingSequenceParsingDetails ? null : (
                <SequenceParsingDetails
                  ignoringNumbers={ignoringNumbers}
                  ignoreNumbers={b => ignoreNumbers(b)}
                  ignoringNonAugctLetters={ignoringNonAugctLetters}
                  ignoreNonAugctLetters={b => ignoreNonAugctLetters(b)}
                  ignoringNonAlphanumerics={ignoringNonAlphanumerics}
                  ignoreNonAlphanumerics={b => ignoreNonAlphanumerics(b)}
                />
              )}
            </div>
            <div style={{ flexBasis: '0px', flexGrow: 1, display: 'flex', flexDirection: 'row' }} >
              <DotBracketField
                initialValue={dotBracket}
                set={s => setDotBracket(s)}
                toggleParsingDetails={() => showDotBracketParsingDetails(!showingDotBracketParsingDetails)}
                flexGrow={1}
              />
              {showingDotBracketParsingDetails ? <DotBracketParsingDetails /> : null}
            </div>
          </div>
          {!errorMessage ? null : (
            <div style={{ marginTop: '12px' }} >
              <p
                key={errorMessageKey}
                className={'unselectable-text'}
                style={{ fontSize: '14px', color: 'red', animationName: 'fadein', animationDuration: '0.75s' }}
              >
                <b>{errorMessage}</b>
              </p>
            </div>
          )}
          <div style={{ marginTop: errorMessage ? '6px' : '24px' }} >
            <ActionButton
              text={'Submit'}
              onClick={() => {
                let parsed = parseInputs({
                  sequenceId: sequenceId,
                  sequence: sequence,
                  ignoreNumbers: ignoringNumbers,
                  ignoreNonAugctLetters: ignoringNonAugctLetters,
                  ignoreNonAlphanumerics: ignoringNonAlphanumerics,
                  dotBracket: dotBracket,
                });
                if (typeof parsed == 'string') {
                  setErrorMessage(parsed);
                  setErrorMessageKey(errorMessageKey + 1);
                } else {
                  props.app.strictDrawing.appendStructure({ ...parsed, characters: parsed.sequence });
                  if (props.app.strictDrawing.drawing.numSecondaryBonds == 0) {
                    props.app.strictDrawing.flatOutermostLoop();
                    props.app.strictDrawingInteraction.startFolding();
                    props.app.strictDrawingInteraction.foldingMode.forcePair();
                  }
                  props.close();
                  props.app.drawingChangedNotByInteraction();
                }
              }}
            />
          </div>
        </div>
      }
    />
  );
}
