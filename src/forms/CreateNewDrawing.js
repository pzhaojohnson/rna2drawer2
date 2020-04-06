import React from 'react';
import PropTypes from 'prop-types';
import parseSequenceId from '../parse/parseSequenceId';
import parseSequence from '../parse/parseSequence';
import {
  parseDotBracket,
  hasUnmatchedUpPartner,
  lastUnmatchedUpPartner,
  hasUnmatchedDownPartner,
  lastUnmatchedDownPartner,
} from '../parse/parseDotBracket';

const _EXAMPLE_INPUTS = [
  {
    exampleInput: '--- None ---',
    sequenceId: '',
    sequence: '',
    structure: '',
  },
  {
    exampleInput: 'Several Hairpins',
    sequenceId: 'Several Hairpins',
    sequence: 'AGCGCAUACGAUAACCAUCGCCGCGCAUCGGCCAGCAUCGGGCCAAGGCUGCACGCCAUUGCAUGGUGUGUAAAGCU',
    structure:'.((((...((((....))))..))))...((((.......)))).....(((((((((.....))))))))).....',
  },
  {
    exampleInput: "PEMV2 3'UTR",
    sequenceId: "PEMV2 3'UTR",
    sequence: 'UUAACUAGGCGGGCGUGUUGGUUACAGUAGGAGGGGACAGUGCGCAUCGAAACUGAGCCCCACCACAACUCUCAUCCACGGGGUGGUUGGGACGCAGGUGUCGGAGGGAUCGCCAGCCCUCAGGAUAGUGAGCUCCCGCAGAGGGAUAAGCUAUCUCCCUGCGACGUAGUGGUAGAACACGUGGGAUAGGGGAUGACCUUGUCGACCGGUUAUCGGUCCCCUGCUCCUUCGAGCUGGCAAGGCGCUCACAGGUUCUACACUGCUACUAAAGUUGGUGGUGGAUGUCUCGCCCAAAAAGAUCACAAACGCGCGGGACAAGGUCCCUUCCACCUUCGCCGGGUAAGGCUAGAGUCAGCGCUGCAUGACUAUAACUUGCGGCCGAUCCAGUUGCACGACUGGUGGUCCCCCUCAGUGUCUCGGUUGUCUGCCGAGUGGGCGGUGGUCGGAUUCCACCACACCCUGCCACGAGGUGCGUGGAGACUUGGCCAGUCUAGGCUCGUCGUAAUUAGUUGCAGCGACGUUAAUCAACCCGUCCGGGCAUAUAAUAGGACCGGUUGUGCUUCUUCCUCCCUUCUUAGCCAGGUGGUUACCUCCCUGGCGCCC',
    structure: '.......(((.((((....(((.......(((((((((.....((.(((....))))).(((((((((((((((.((((...)))).)))).((((((.....(((((........))))).(((((((....((((.....))))...))))))).))))))...(((((((((.....(((((((..(((.((.((((((((((((.....)))))....((((....)))).))))))))))))....))))))).))))))))).)))).))))))).((((((((...................))))))))..))))))))))))..))))(((..(((..((((.(..(((((((..((((....(((((((.((.......((..(((((((((((((((((.(((.((((((.....)))))).(((..(((((.((...))))))).)))...))))))).....)).))))..)))))))...))))))))))).)))))))))))........(((((.((((............)))).))))).).)))).))))))......((((((..(....)..))))))))).',
  },
];

class CreateNewDrawing extends React.Component {
  constructor(props) {
    super(props);

    let ei = _EXAMPLE_INPUTS[0];

    this.state = {
      exampleInput: ei.exampleInput,
      sequenceId: ei.sequenceId,
      sequence: ei.sequence,
      structure: ei.structure,

      showSequenceParsingDetails: false,
      ignoreNumbers: true,
      ignoreNonAUGCTLetters: true,
      ignoreNonAlphanumerics: true,

      showStructureParsingDetails: false,

      errorMessage: '',
    };
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: '100%',
          backgroundColor: '#fcfcfc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            flexGrow: '1',
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              flexGrow: '1',
              maxWidth: '1200px',
              margin: '16px',
              border: 'thin solid #bfbfbf',
              borderRadius: '32px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {this._titleAndContent()}
          </div>
        </div>
      </div>
    );
  }

  _titleAndContent() {
    return (
      <div
        style={{
          flexGrow: '1',
          margin: '32px 64px 32px 64px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this._title()}
        {this._content()}
      </div>
    );
  }

  _title() {
    return (
      <div>
        {this._titleText()}
        {this._titleUnderline()}
      </div>
    );
  }

  _titleText() {
    return (
      <p className={'unselectable-text'} style={{ margin: '0px 8px 0px 8px', fontSize: '24px' }} >
        Create a New Drawing
      </p>
    );
  }

  _titleUnderline() {
    return (
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          margin: '8px 0px 0px 0px',
        }}
      ></div>
    );
  }

  _content() {
    return (
      <div
        style={{
          flexGrow: '1',
          margin: '16px 16px 0px 16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this._exampleInputSection()}
        {this._sequenceIdSection()}
        {this._sequenceAndStructureSections()}
        {this._errorMessageSection()}
        {this._submitSection()}
      </div>
    );
  }

  _exampleInputSection() {
    return (
      <div style={{ margin: '0px', alignItems: 'center' }} >
        {this._exampleInputLabel()}
        {this._exampleInputSelect()}
      </div>
    );
  }

  _exampleInputLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{ margin: '0px 8px 0px 0px', fontSize: '12px', display: 'inline-block' }}
      >
        Example Input:
      </p>
    );
  }

  _exampleInputSelect() {
    return (
      <select
        value={this.state.exampleInput}
        onChange={event => this._onExampleInputSelectChange(event)}
        style={{ fontSize: '12px' }}
      >
        {_EXAMPLE_INPUTS.map(ei => {
          return (
            <option key={ei.exampleInput} value={ei.exampleInput}>
              {ei.exampleInput}
            </option>
          );
        })}
      </select>
    );
  }

  _onExampleInputSelectChange(event) {
    let ei = _EXAMPLE_INPUTS.find(
      ei => ei.exampleInput === event.target.value
    );
    this.setState({
      exampleInput: ei.exampleInput,
      sequenceId: ei.sequenceId,
      sequence: ei.sequence,
      structure: ei.structure
    });
  }

  _sequenceIdSection() {
    return (
      <div
        style={{
          margin: '16px 0px 0px 0px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this._sequenceIdLabel()}
        {this._sequenceIdInput()}
      </div>
    );
  }

  _sequenceIdLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{ margin: '0px 8px 0px 0px', fontSize: '12px', display: 'inline-block' }}
      >
        Sequence ID:
      </p>
    );
  }

  _sequenceIdInput() {
    return (
      <input
        type={'text'}
        value={this.state.sequenceId}
        onChange={event => this._onSequenceIdInputChange(event)}
        spellCheck={'false'}
        placeholder={' ...the name of your sequence'}
        style={{ flexGrow: '1' }}
      />
    );
  }

  _onSequenceIdInputChange(event) {
    this.setState({
      sequenceId: event.target.value,
    });
  }

  _sequenceAndStructureSections() {
    return (
      <div style={{ margin: '0px 0px 10px 0px', flexGrow: '1' }} >
        {this._sequenceSection()}
        {this._structureSection()}
      </div>
    );
  }

  _sequenceSection() {
    return (
      <div style={{ height: '50%', display: 'flex', flexDirection: 'row' }} >
        <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }} >
          {this._sequenceHeader()}
          {this._sequenceTextarea()}
        </div>
        {this._sequenceParsingDetails()}
      </div>
    );
  }

  _sequenceHeader() {
    return (
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'row' }} >
        {this._sequenceLabel()}
        {this._sequenceParsingDetailsToggle()}
      </div>
    );
  }

  _sequenceLabel() {
    return (
      <p className={'unselectable-text'} style={{ flexGrow: '1', fontSize: '12px' }} >
        Sequence:
      </p>
    );
  }

  _sequenceParsingDetailsToggle() {
    return (
      <p
        className={'unselectable-text'}
        onClick={() => this._toggleSequenceParsingDetails()}
        style={{
          marginRight: '4px',
          fontSize: '12px',
          color: 'blue',
          cursor: 'pointer',
        }}
      >
        Details
      </p>
    );
  }

  _toggleSequenceParsingDetails() {
    this.setState({
      showSequenceParsingDetails: !this.state.showSequenceParsingDetails,
    });
  }

  _sequenceTextarea() {
    return (
      <textarea
        value={this.state.sequence}
        onChange={event => this._onSequenceTextareaChange(event)}
        spellCheck={'false'}
        placeholder={' ...an RNA or DNA sequence, e.g. "AUGCAUUACGUA"'}
        style={{
          flexGrow: '1',
          margin: '4px 0px 0px 0px',
          fontSize: '12px',
        }}
      />
    );
  }

  _onSequenceTextareaChange(event) {
    this.setState({
      sequence: event.target.value
    });
  }

  _sequenceParsingDetails() {
    if (!this.state.showSequenceParsingDetails) {
      return <div></div>;
    } else {
      return (
        <div style={{ width: '360px', margin: '16px 0px 0px 8px' }} >
          <p className={'unselectable-text'} style={{ fontWeight: 'bold', fontSize: '14px' }} >
            Sequence Parsing Details:
          </p>
          <div style={{ marginLeft: '8px' }} >
            <p className={'unselectable-text'} style={{ marginTop: '8px', fontSize: '12px' }} >
              All letters, numbers, and non-alphanumeric characters are read in as individual bases, unless specified to be ignored below:
            </p>
            {this._ignoreNumbersCheckbox()}
            {this._ignoreNonAUGCTLettersCheckbox()}
            {this._ignoreNonAlphanumericsCheckbox()}
            <p className={'unselectable-text'} style={{ marginTop: '10px', fontSize: '12px' }}>
              All whitespace is ignored.
            </p>
          </div>
        </div>
      );
    }
  }

  _ignoreNumbersCheckbox() {
    return (
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.state.ignoreNumbers}
          onChange={() => this._toggleIgnoreNumbers()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          Ignore numbers.
        </p>
      </div>
    );
  }

  _toggleIgnoreNumbers() {
    this.setState({
      ignoreNumbers: !this.state.ignoreNumbers,
    });
  }

  _ignoreNonAUGCTLettersCheckbox() {
    return (
      <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.state.ignoreNonAUGCTLetters}
          onChange={() => this._toggleIgnoreNonAUGCTLetters()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          Ignore non-AUGCT letters.
        </p>
      </div>
    );
  }

  _toggleIgnoreNonAUGCTLetters() {
    this.setState({
      ignoreNonAUGCTLetters: !this.state.ignoreNonAUGCTLetters,
    });
  }

  _ignoreNonAlphanumericsCheckbox() {
    return (
      <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type={'checkbox'}
          checked={this.state.ignoreNonAlphanumerics}
          onChange={() => this._toggleIgnoreNonAlphanumerics()}
        />
        <p className={'unselectable-text'} style={{ marginLeft: '6px', fontSize: '12px' }} >
          Ignore non-alphanumeric characters.
        </p>
      </div>
    );
  }

  _toggleIgnoreNonAlphanumerics() {
    this.setState({
      ignoreNonAlphanumerics: !this.state.ignoreNonAlphanumerics,
    });
  }

  _structureSection() {
    return (
      <div style={{ height: '50%', display: 'flex', flexDirection: 'row' }} >
        <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }} >
          {this._structureHeader()}
          {this._structureTextarea()}
        </div>
        {this._structureParsingDetails()}
      </div>
    );
  }

  _structureHeader() {
    return (
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'row' }} >
        {this._structureLabel()}
        {this._structureParsingDetailsToggle()}
      </div>
    );
  }

  _structureLabel() {
    return (
      <p className={'unselectable-text'} style={{ flexGrow: '1', fontSize: '12px' }} >
        Structure (optional):
      </p>
    );
  }

  _structureParsingDetailsToggle() {
    return (
      <p
        className={'unselectable-text'}
        onClick={() => this._toggleStructureParsingDetails()}
        style={{
          marginRight: '4px',
          fontSize: '12px',
          color: 'blue',
          cursor: 'pointer',
        }}
      >
        Details
      </p>
    );
  }

  _toggleStructureParsingDetails() {
    this.setState({
      showStructureParsingDetails: !this.state.showStructureParsingDetails,
    })
  }

  _structureTextarea() {
    return (
      <textarea
        value={this.state.structure}
        onChange={event => this._onStructureTextareaChange(event)}
        spellCheck={'false'}
        placeholder={' ...the secondary structure in dot-bracket notation, e.g. "((((....))))"'}
        style={{
          flexGrow: '1',
          margin: '4px 0px 0px 0px',
          fontSize: '12px'
        }}
      />
    );
  }

  _onStructureTextareaChange(event) {
    this.setState({
      structure: event.target.value
    });
  }

  _structureParsingDetails() {
    if (!this.state.showStructureParsingDetails) {
      return <div></div>;
    } else {
      return (
        <div style={{ width: '360px', margin: '16px 0px 0px 8px' }} >
          <p className={'unselectable-text'} style={{ fontWeight: 'bold', fontSize: '14px' }} >
            Structure Parsing Details:
          </p>
          <div style={{ marginLeft: '8px' }} >
            <p className={'unselectable-text'} style={{ marginTop: '8px', fontSize: '12px' }} >
              Periods "." indicate unpaired bases.
            </p>
            <p className={'unselectable-text'} style={{ marginTop: '10px', fontSize: '12px' }} >
              Matching parentheses "( )" indicate base pairs in the secondary structure.
            </p>
            <p className={'unselectable-text'} style={{ marginTop: '10px', fontSize: '12px' }} >
              {'Pseudoknotted base pairs are specified by "[ ]", "{ }", or "< >".'}
            </p>
            <p className={'unselectable-text'} style={{ marginTop: '10px', fontSize: '12px' }} >
              All other characters and whitespace are ignored.
            </p>
          </div>
        </div>
      );
    }
  }

  _errorMessageSection() {
    if (this.state.errorMessage.length === 0) {
      return <div></div>;
    } else {
      return (
        <div>
          <p
            className={'unselectable-text'}
            style={{
              margin: '0px',
              fontSize: '14px',
              color: 'red',
            }}
          >
            <b>{this.state.errorMessage}</b>
          </p>
        </div>
      );
    }
  }

  _submitSection() {
    return (
      <div style={{ margin: '6px 0px 0px 0px' }} >
        <button
          onClick={() => this._submit()}
          style={{ padding: '4px 32px 4px 32px', fontSize: '12px' }}
        >
          Submit
        </button>
      </div>
    );
  }

  _submit() {
    let sequenceId = this._parseSequenceId();
    if (sequenceId === null) {
      return;
    }
    let sequence = this._parseSequence();
    if (sequence === null) {
      return;
    }
    let structure = this._parseStructure(sequence);
    if (structure === null) {
      return;
    }
    this.props.submit(
      sequenceId,
      sequence,
      structure.secondaryPartners,
      structure.tertiaryPartners,
    );
  }

  /**
   * Returns null if the sequence ID is empty.
   * 
   * @returns {string|null} 
   */
  _parseSequenceId() {
    let sequenceId = parseSequenceId(this.state.sequenceId);
    if (sequenceId.length === 0) {
      this.setState({ errorMessage: 'Sequence ID is empty.' });
      return null;
    } else {
      return sequenceId;
    }
  }

  /**
   * Returns null if the sequence is empty.
   * 
   * @returns {string|null} 
   */
  _parseSequence() {
    let sequence = parseSequence(this.state.sequence, {
      ignoreNumbers: this.state.ignoreNumbers,
      ignoreNonAUGCTLetters: this.state.ignoreNonAUGCTLetters,
      ignoreNonAlphanumerics: this.state.ignoreNonAlphanumerics,
    });
    if (sequence.length === 0) {
      this.setState({ errorMessage: 'Sequence is empty.' });
      return null;
    } else {
      return sequence;
    }
  }

  /**
   * @typedef {Object} CreateNewDrawing~ParsedStructure 
   * @property {Array<number|null>} secondaryPartners 
   * @property {Array<number|null>} tertiaryPartners 
   */

  /**
   * Returns null if the structure is invalid.
   * 
   * Also returns null if the length of the parsed structure does not
   * match the length of the sequence. However, if the length of the
   * parsed structure is zero, then this method will return entirely
   * unpaired partners notations of the same length as the sequence.
   * 
   * @param {string} sequence 
   * 
   * @returns {CreateNewDrawing~ParsedStructure|null} 
   */
  _parseStructure(sequence) {
    let parsed = parseDotBracket(this.state.structure);
    if (parsed === null) {
      if (hasUnmatchedUpPartner(this.state.structure)) {
        let c = lastUnmatchedUpPartner(this.state.structure);
        this.setState({ errorMessage: 'Unmatched "' + c + '" in structure.' });
      } else if (hasUnmatchedDownPartner(this.state.structure)) {
        let c = lastUnmatchedDownPartner(this.state.structure);
        this.setState({ errorMessage: 'Unmatched "' + c + '" in structure.' });
      } else {
        this.setState({ errorMessage: 'Invalid structure.' });
      }
      return null;
    }

    if (parsed.secondaryPartners.length === 0) {
      let structure = { secondaryPartners: [], tertiaryPartners: [] };
      for (let i = 0; i < sequence.length; i++) {
        structure.secondaryPartners.push(null);
        structure.tertiaryPartners.push(null);
      }
      return structure;
    } else {
      if (parsed.secondaryPartners.length !== sequence.length) {
        this.setState({ errorMessage: 'Sequence and structure are different lengths.' });
        return null;
      } else {
        return parsed;
      }
    }
  }
}

CreateNewDrawing.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  submit: PropTypes.func,
};

CreateNewDrawing.defaultProps = {
  width: '100vw',
};

export default CreateNewDrawing;

export {
  CreateNewDrawing,

  // only exported to aid testing
  _EXAMPLE_INPUTS,
};
