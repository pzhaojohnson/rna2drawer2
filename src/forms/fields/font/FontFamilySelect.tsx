import * as React from 'react';
import Select from 'react-select';
import { availableFontFamilies } from './availableFontFamilies';

type Option = {
  value: string;
  label: string;
}

function isOption(v: any): v is Option {
  return (
    typeof v == 'object'
    && v != null
    && typeof v.value == 'string'
    && typeof v.label == 'string'
  );
}

function toOption(value: string): Option {
  return { value: value, label: value };
}

export type ChangeEvent = {
  target: {
    value: string;
  }
}

export type Props = {
  value?: string;
  onChange: (event: ChangeEvent) => void;
}

export function FontFamilySelect(props: Props) {
  return (
    <Select
      defaultValue={typeof props.value == 'string' ? toOption(props.value) : undefined}
      options={availableFontFamilies().map(ff => toOption(ff))}
      placeholder=''
      isMulti={false}
      isClearable={false}
      isSearchable={false}
      onChange={newValue => {
        if (isOption(newValue)) {
          // give the select component time to rerender before possibly being unmounted
          // by the change event callback (otherwise, React might complain about memory
          // leaks)
          setTimeout(
            () => props.onChange({ target: { value: newValue.value } }),
            250,
          );
        }
      }}
      styles={{
        container: provided => ({
          ...provided,
          minWidth: '215px',
          fontFamily: 'Open Sans',
          fontSize: '12px',
        }),
        control: (provided, state) => ({
          ...provided,
          minHeight: '26px',
          boxSizing: 'border-box',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: state.isFocused ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)',
          borderRadius: '2px',
          boxShadow: 'none',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'rgba(0,0,0,0.8)',
          },
        }),
        valueContainer: provided => ({
          ...provided,
          padding: '0px',
          overflow: 'visible',
        }),
        indicatorsContainer: provided => ({
          ...provided,
          padding: '0px',
        }),
        dropdownIndicator: (provided, state) => ({
          ...provided,
          margin: '0px 2px',
          padding: '0px',
          color: 'rgba(0,0,0,0.8)',
          transform: state.isFocused ? 'scale(0.735)' : 'scale(0.6)',
          '&:hover': {
            color: 'rgba(0,0,0,0.8)',
            transform: 'scale(0.735)',
            transition: 'all 0.25s ease-in-out',
          },
        }),
        indicatorSeparator: provided => ({
          ...provided,
          marginTop: '6px',
          marginBottom: '6px',
          backgroundColor: 'rgba(0,0,0,0.1)',
        }),
        menu: provided => ({
          ...provided,
          margin: '6px 0px',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'gray' : 'white',
          fontFamily: state.data.value,
          color: state.isSelected ? 'white' : 'rgba(0,0,0,0.8)',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: state.isSelected ? 'gray' : 'gainsboro',
            color: state.isSelected ? 'white' : 'rgba(0,0,0,0.8)',
          },
        }),
        singleValue: (provided, state) => ({
          ...provided,
          marginLeft: '7px',
          marginRight: '7px',
          fontFamily: state.data.value,
          color: 'rgba(0,0,0,0.8)',
          overflow: 'visible',
        }),
      }}
    />
  );
}
