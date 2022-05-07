import * as React from 'react';
import { useState } from 'react';
import { ErrorMessage } from 'Forms/ErrorMessage';
import type { App } from 'App';
import { FloatingDrawingsContainer } from '../containers/floatingDrawings/FloatingDrawingsContainer';
import { ExampleSelect } from './ExampleSelect';
import { SequenceIdField } from './SequenceIdField';
import { SequenceField } from './SequenceField';
import { SequenceParsingDetails } from './SequenceParsingDetails';
import { DotBracketField } from './DotBracketField';
import { DotBracketParsingDetails } from './DotBracketParsingDetails';
import { SolidButton } from '../buttons/SolidButton';
import { parseInputs } from './parseInputs';

let examples = [
  {
    name: 'A Small Structure',
    sequenceId: 'A Small Structure',
    sequence: 'UAAGCGCAUAGACGAUGCAACCGCAUCGCCUAGCGCUUAGAUCGGCCAACAGCAUCGGUUGGCCAAUAGGCUGCACGCCAUCAUUUGCAUGGUGUGUAAAGCUU',
    dotBracket:'...((((.....((((((....))))))....)))).......(((((((.......))))))).......(((((((((.........)))))))))......',
  },
  {
    name: 'A Large Structure',
    sequenceId: 'A Large Structure',
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

function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <p style={{ margin: '0px 99px', fontSize: '24px', fontWeight: 600, color: '#1e1e21' }} >
        Create a New Drawing
      </p>
      <div style={{ marginTop: '8px' }} >
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px 1px 0px',
            borderStyle: 'solid',
            borderColor: '#e0e0ea',
          }}
        />
      </div>
    </div>
  );
}

interface Props {
  app: App;
  close: () => void;
}

export function CreateNewDrawing(props: Props): React.ReactElement {
  let [sequenceId, setSequenceId] = useState('');
  let [sequence, setSequence] = useState('');
  let [dotBracket, setDotBracket] = useState('');

  let [showingSequenceParsingDetails, showSequenceParsingDetails] = useState(false);
  let [ignoringNumbers, ignoreNumbers] = useState(true);
  let [ignoringNonAugctLetters, ignoreNonAugctLetters] = useState(false);
  let [ignoringNonAlphanumerics, ignoreNonAlphanumerics] = useState(true);

  let [showingDotBracketParsingDetails, showDotBracketParsingDetails] = useState(false);

  let [errorMessage, setErrorMessage] = useState('');
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  return (
    <FloatingDrawingsContainer
      contained={
        <div style={{ width: '942px', height: '571px', display: 'flex', flexDirection: 'column' }} >
          <Header />
          <div style={{ margin: '0px 129px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
            <div style={{ marginTop: '24px' }} >
              <ExampleSelect
                examples={examples.map(e => e.name)}
                select={name => {
                  let example = examples.find(e => e.name == name);
                  if (example) {
                    setSequenceId(example.sequenceId);
                    setSequence(example.sequence);
                    setDotBracket(example.dotBracket);
                    setErrorMessage('');
                  }
                }}
              />
            </div>
            <div style={{ marginTop: '24px' }} >
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
            <div style={{ margin: '24px 0 8px 0', display: 'flex', alignItems: 'center' }} >
              <SolidButton
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
                    if (props.app.strictDrawing.drawing.secondaryBonds.length == 0) {
                      props.app.strictDrawing.flatOutermostLoop();
                      let strictDrawingInteraction = props.app.strictDrawingInteraction;
                      strictDrawingInteraction.currentTool = strictDrawingInteraction.bindingTool;
                      strictDrawingInteraction.bindingTool.showComplements = false;
                    }
                    props.close();
                    // prevent coming back to this form or preceding forms
                    props.app.formContainer.clearHistory();
                    props.app.refresh();
                  }
                }}
              />
              {!errorMessage ? null : (
                <ErrorMessage key={errorMessageKey} style={{ marginLeft: '10px' }} >
                  {errorMessage}
                </ErrorMessage>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
