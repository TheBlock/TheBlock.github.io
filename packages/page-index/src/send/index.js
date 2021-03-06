// GPLv3, Copyright (C) 2017, theBlock, https://theblock.io
// @flow

import compact from 'lodash.compact';
import { observer } from 'mobx-react';
import React, { type Element } from 'react';
import { Interpolate, translate } from 'react-i18next';

import Button from '@theblock/lib-ui/src/button';
import Field from '@theblock/lib-ui/src/field';
import Form from '@theblock/lib-ui/src/form';
import InputAddress from '@theblock/lib-ui/src/input/address';
import InputHex from '@theblock/lib-ui/src/input/hex';
import InputNumber from '@theblock/lib-ui/src/input/number';
import InputStatic from '@theblock/lib-ui/src/input/static';
import Select from '@theblock/lib-ui/src/input/select';

import accounts from '../store/accounts';
import addresses from '../store/addresses';
import store from './store';
import styles from './send.scss';

type PropTypes = {
  className?: string,
  t: (string) => string
};

function Send ({ className, t }: PropTypes): Element<any> {
  return (
    <main
      className={
        compact([
          styles.root, className
        ]).join(' ')
      }
    >
      <section>
        <Form>
          <div>
            <Field>
              <Interpolate
                i18nKey='account.text'
                parent='div'
              />
              <div>
                <Select store={ accounts } />
              </div>
            </Field>
            <Field>
              <Interpolate
                i18nKey='balance.text'
                parent='div'
              />
              <div>
                <InputStatic
                  value={
                    store.valueType.selected.isNative
                      ? store.balance.balanceFormatted
                      : store.balance.balanceFiatFormatted
                  }
                />
                <Select store={ store.tokens } />
              </div>
            </Field>
            <Field>
              <Interpolate
                i18nKey='value.text'
                parent='div'
              />
              <div>
                <InputNumber
                  onChange={ store.setTxValue }
                  isWarning={ store.txValueBn.isZero() }
                  step={ 0.001 }
                  value={ store.txValue }
                  valueDisplay={
                    store.txValueFormatted || t('value.empty')
                  }
                />
                <Select store={ store.valueType } />
              </div>
            </Field>
            <Field>
              <Interpolate
                i18nKey='recipient.text'
                parent='div'
              />
              <div>
                <InputAddress
                  example={ t('recipient.example') }
                  isBusy={ store.isBusyLookup }
                  isError={ store.hasRecipientError }
                  isMaxWidth
                  onChange={ store.setRecipient }
                  store={ addresses }
                  value={ store.recipient }
                  valueAddress={ store.recipientAddress }
                />
              </div>
            </Field>
          </div>
          <aside>
            <Interpolate
              i18nKey='help.overview'
              parent='div'
            />
            <Interpolate
              i18nKey='help.gas'
              parent='div'
            />
          </aside>
        </Form>
      </section>
      <section>
        <Interpolate
          i18nKey='data.text'
          data={
            <InputHex
              example={ t('data.example') }
              isError={ store.hasTxDataError }
              onChange={ store.setTxData }
              value={ store.txData }
              valueDisplay={ store.txDataFormatted || t('data.empty') }
            />
          }
        />
        { ' ' }
        <Interpolate
          i18nKey='gasLimit.text'
          gasLimit={
            <InputNumber
              onChange={ store.setGasLimit }
              step={ 21000 }
              value={ store.gasLimit }
              valueDisplay={ store.gasLimitFormatted || t('gasLimit.empty') }
            />
          }
        />
        { ' ' }
        <Interpolate
          i18nKey='gasPrice.text'
          gasPrice={
            <InputNumber
              onChange={ store.setGasPrice }
              step={ 10.0 }
              value={ store.gasPrice }
              valueDisplay={ store.gasPriceFormatted || t('gasPrice.empty') }
            />
          }
        />
      </section>
      <section>
        <Button
          isBusy={ store.isBusySending }
          isDisabled={ store.hasError }
          label={
            store.isBusySending
              ? t('buttons.send.busy')
              : t('buttons.send.label')
          }
          onClick={ store.send }
        />
      </section>
    </main>
  );
}

export default translate(['send'])(observer(Send));
