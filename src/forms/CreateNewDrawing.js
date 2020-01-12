import React from 'react';

class CreateNewDrawing extends React.Component {
  stylesUnselectableText() {
    return {
      userSelect: 'none',
      cursor: 'default'
    };
  }

  stylesOutermostDiv() {
    return {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    };
  }

  stylesTitle() {
    return {
      ...this.stylesUnselectableText(),
      margin: '12px 24px 0px 24px',
      fontSize: '28px'
    };
  }

  stylesTitleUnderline() {
    return {
      height: '0.75px',
      margin: '8px 16px 0px 16px',
      backgroundColor: '#bfbfbf'
    };
  }

  stylesExampleInputDiv() {
    return {
      margin: '18px 28px 0px 28px',
      alignItems: 'center'
    };
  }

  stylesExampleInputLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '0px 8px 0px 0px',
      fontSize: '14px',
      display: 'inline-block'
    };
  }

  stylesExampleInputSelect() {
    return {
      fontSize: '14px'
    };
  }

  stylesSequenceIdDiv() {
    return {
      margin: '18px 28px 0px 28px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };
  }

  stylesSequenceIdLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '0px 8px 0px 0px',
      fontSize: '14px',
      display: 'inline-block'
    };
  }

  stylesSequenceIdInput() {
    return {
      flexGrow: '1'
    };
  }

  get sequenceIdPlaceholder() {
    return ' ...the name of your sequence';
  }

  stylesSequenceLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '18px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  stylesSequenceTextarea() {
    return {
      flexGrow: '1',
      margin: '4px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  get sequencePlaceholder() {
    return ' ...an RNA or DNA sequence, e.g. "AUGCAUUACGUA"';
  }

  stylesStructureLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '18px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  stylesStructureTextarea() {
    return {
      flexGrow: '1',
      margin: '4px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  get structurePlaceholder() {
    return ' ...the secondary structure in dot-bracket notation, e.g "((((....))))"';
  }

  stylesSubmitOuterDiv() {
    return {
      margin: '18px 28px 18px 28px',
      display: 'flex',
      flexDirection: 'row'
    };
  }

  stylesSubmitInnerDiv() {
    return {
      flexGrow: '1'
    };
  }

  stylesSubmitButton() {
    return {
      padding: '8px 64px 8px 64px',
      fontSize: '12px'
    };
  }

  render() {
    return (
      <div style={this.stylesOutermostDiv()} >
        <p style={this.stylesTitle()} >Create a New Drawing</p>
        <div style={this.stylesTitleUnderline()} ></div>
        <div style={this.stylesExampleInputDiv()} >
          <p style={this.stylesExampleInputLabel()} >Example Input:</p>
          <select defaultValue={'--- None ---'} onChange={() => null} style={this.stylesExampleInputSelect()} >
            <option value={'--- None ---'} >--- None ---</option>
            <option value={'kl-TSS and PTE'} >kl-TSS and PTE</option>
            <option value={"PEMV-2 3' UTR"} >PEMV-2 3' UTR</option>
          </select>
        </div>
        <div style={this.stylesSequenceIdDiv()} >
          <p style={this.stylesSequenceIdLabel()} >Sequence ID:</p>
          <input type={'text'} style={this.stylesSequenceIdInput()} spellCheck={'false'} placeholder={this.sequenceIdPlaceholder} />
        </div>
        <p style={this.stylesSequenceLabel()} >Sequence:</p>
        <textarea style={this.stylesSequenceTextarea()} spellCheck={'false'} placeholder={this.sequencePlaceholder} />
        <p style={this.stylesStructureLabel()} >Structure (optional):</p>
        <textarea style={this.stylesStructureTextarea()} spellCheck={'false'} placeholder={this.structurePlaceholder} />
        <div style={this.stylesSubmitOuterDiv()} >
          <div style={this.stylesSubmitInnerDiv()} ></div>
          <button style={this.stylesSubmitButton()} >Submit</button>
        </div>
      </div>
    );
  }

  onExampleInputChange() {}

  submit() {}
}

CreateNewDrawing.defaultProps = {
  width: '100%',
  height: '100%'
};

export default CreateNewDrawing;
