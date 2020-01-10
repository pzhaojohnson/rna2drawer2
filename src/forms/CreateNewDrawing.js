import React from 'react';
import './CreateNewDrawing.css';

let _contentMarginHorizontal = 24;

let _fontFamily = 'Segoe UI';

let _sequenceIdPlaceholder = ' ...the name of your sequence';
let _sequencePlaceholder = ' ...an RNA or DNA sequence, e.g. "AUGCAUUACGUA"';
let _structurePlaceholder = ' ...the secondary structure in dot-bracket notation, e.g "((((....))))"';

class CreateNewDrawing extends React.Component {
  stylesOutermostDiv() {
    return {
      width: this.props.width,
      height: this.props.height,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'whitesmoke'
    };
  }

  stylesItem() {
    return {
      marginLeft: 28,
      marginRight: 28,
      marginTop: 0,
      marginBottom: 0,
      padding: 0
    };
  }

  stylesLabel() {
    return {
      ...this.stylesItem(),
      userSelect: 'none',
      cursor: 'default'
    };
  }

  stylesTitle() {
    return {
      ...this.stylesLabel(),
      marginLeft: 24,
      marginTop: 12,
    };
  }

  stylesTitleUnderline() {
    return {
      marginLeft: 16,
      marginRight: 16,
      marginTop: 8,
      height: 0.75,
      backgroundColor: '#bfbfbf'
    };
  }

  stylesExampleInputDiv() {
    return {
      marginTop: 18
    };
  }

  stylesExampleInputLabel() {
    return {
      ...this.stylesLabel(),
      display: 'inline-block',
      marginRight: 8
    };
  }

  stylesExampleInputSelect() {
    return {
      fontFamily: 'Segoe UI',
      fontSize: 14
    };
  }

  stylesSequenceIdDiv() {
    return {
      ...this.stylesItem(),
      marginTop: 18,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };
  }

  stylesSequenceIdLabel() {
    return {
      ...this.stylesLabel(),
      display: 'inline-block',
      marginLeft: 0,
      marginRight: 8
    };
  }

  stylesSequenceIdInput() {
    return {
      flexGrow: 1
    };
  }

  stylesSequenceLabel() {
    return {
      ...this.stylesLabel(),
      marginTop: 18
    };
  }

  stylesSequenceTextarea() {
    return {
      marginLeft: 28,
      marginRight: 28,
      marginTop: 4,
      marginBottom: 0,
      flexGrow: 1
    };
  }

  stylesStructureLabel() {
    return {
      ...this.stylesLabel(),
      marginTop: 18
    };
  }

  stylesStructureTextarea() {
    return {
      marginLeft: 28,
      marginRight: 28,
      marginTop: 4,
      marginBottom: 0,
      flexGrow: 1,
    };
  }

  stylesSubmitDiv() {
    return {
      ...this.stylesItem(),
      marginTop: 18,
      marginBottom: 18,
      display: 'flex',
      flexDirection: 'row'
    };
  }

  stylesSubmitButton() {
    return {
      paddingLeft: 56,
      paddingRight: 56,
      paddingTop: 8,
      paddingBottom: 8,
      fontFamily: 'Segoe UI',
      fontSize: 12,
      boxShadow: 'none'
    };
  }

  render() {
    return (
      <div style={this.stylesOutermostDiv()} >
        <h1 style={this.stylesTitle()} >Create a New Drawing</h1>
        <div style={this.stylesTitleUnderline()} ></div>
        <div style={this.stylesExampleInputDiv()} >
          <p style={this.stylesExampleInputLabel()} >Example Input:</p>
          <select style={this.stylesExampleInputSelect()} >
            <option>  --- None ---  </option>
            <option>  kl-TSS and PTE  </option>
            <option>  PEMV-2 3' UTR  </option>
          </select>
        </div>
        <div style={this.stylesSequenceIdDiv()} >
          <p style={this.stylesSequenceIdLabel()} >Sequence ID:</p>
          <input
            class={'create-new-drawing-input'}
            type={'text'}
            style={this.stylesSequenceIdInput()}
            spellcheck={'false'}
            placeholder={_sequenceIdPlaceholder}
          />
        </div>
        <p style={this.stylesSequenceLabel()} >Sequence:</p>
        <textarea
          style={this.stylesSequenceTextarea()}
          spellcheck={'false'}
          placeholder={_sequencePlaceholder}
        />
        <p style={this.stylesStructureLabel()} >Structure (optional):</p>
        <textarea
          class={'create-new-drawing-textarea'}
          style={this.stylesStructureTextarea()}
          spellCheck={'false'}
          placeholder={_structurePlaceholder}
        />
        <div style={this.stylesSubmitDiv()} >
          <div style={{ flexGrow: 0 }} ></div>
          <button
            id={'create-new-drawing-submit-button'}
            style={this.stylesSubmitButton()}
          >Submit</button>
        </div>
      </div>
    );
  }
}

CreateNewDrawing.defaultProps = {
  width: '100%',
  height: '100%'
};

export default CreateNewDrawing;
