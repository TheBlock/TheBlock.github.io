// GPLv3, Copyright (C) 2017, theBlock, https://theblock.io
// @flow

import compact from 'lodash.compact';
import React, { type Element } from 'react';

import Input from '../index';

import styles from './number.scss';

type PropTypes = {
  className?: string,
  example?: string,
  hint?: string,
  icon?: ?Element<any>,
  isDisabled?: boolean,
  isError?: boolean,
  isInteger?: boolean,
  isReadOnly?: boolean,
  isWarning?: boolean,
  label?: string,
  max?: number,
  min?: number,
  onChange?: (string) => mixed,
  step?: number,
  value?: string,
  valueDisplay?: ?string,
};

export default function InputNumber ({ className, example, hint, icon, isDisabled, isError, isInteger, isReadOnly, isWarning, label, max, min = 0, onChange, step = 0.01, value, valueDisplay }: PropTypes): Element<any> {
  const _onChange = (value: string): void => {
    if (value && !/^[0-9]+([.]?[0-9]*)?$/.test(value)) {
      return;
    }

    onChange && onChange(
      isInteger
        ? value.replace(/[^0-9]/g, '')
        : value
    );
  };

  return (
    <Input
      className={
        compact([
          styles.ui, className
        ]).join(' ')
      }
      example={ example }
      hint={ hint }
      icon={ icon }
      inputProps={ {
        lang: 'en-001', // en-150 for comma
        max,
        min,
        step
      } }
      isDisabled={ isDisabled }
      isError={ isError }
      isReadOnly={ isReadOnly }
      isWarning={ isWarning }
      label={ label }
      onChange={ _onChange }
      type='number'
      value={ value }
      valueDisplay={ valueDisplay }
    />
  );
}
