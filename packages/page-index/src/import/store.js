// GPLv3, Copyright (C) 2017, theBlock, https://theblock.io
// @flow

import { action, autorun, computed, observable } from 'mobx';

import type { PrivateKeyType, WalletType } from '@theblock/lib-util/src/types';

import { getLedgerAddresses, getLedgerHDPath } from '@theblock/lib-hardware/src/ledger';
import { getTrezorAddresses, getTrezorHDPath } from '@theblock/lib-hardware/src/trezor';
import { NULL_ADDRESS } from '@theblock/lib-ui/src/img/identity';
import { formatAddress } from '@theblock/lib-util/src/format';
import { createKeyObject, newKeyObject } from '@theblock/lib-util/src/keys';
import { isHexValid, isMnemonicValid } from '@theblock/lib-util/src/validate';
import { walletFromMnemonic, walletFromPhrase, walletFromPrivateKey, walletFromKeyObject } from '@theblock/lib-util/src/wallet';

import i18n from '../i18n';
import accountsStore from '../store/accounts';
import chainStore from '../store/chains';
import errors from '../store/errors';
import importStorePath from './storePath';
import importStoreType from './storeType';
import importStoreStorage from './storeStorage';

type ImportType = 'bipPhrase' | 'brainPhrase' | 'json' | 'ledger' | 'newKey' | 'privateKey' | 'trezor';
type PathType = 'ledger' | 'trezor';
type StorageType = 'browser' | 'session';
type StateType = 'completed' | 'empty' | 'error' | 'walletFromPhrase' | 'createKeyObject' | 'walletFromKeyObject' | 'addAccount' | 'commsLedger' | 'commsTrezor';

const DEFAULT_STORE: StorageType = 'session';

export class ImportStore {
  @observable accountsStore = accountsStore;
  @observable chains = chainStore;
  @observable isBusy: bool = false;
  @observable jsonFilename: string = '';
  @observable name: string = '';
  @observable password: string = '';
  @observable phrase: string = '';
  @observable privateKey: string = '0x';
  @observable state: StateType = 'empty';
  @observable storage: StorageType = DEFAULT_STORE;
  @observable wallet: WalletType = {};
  @observable walletJson: string = '';
  @observable walletObject: PrivateKeyType = {};
  @observable storePath = importStorePath;
  @observable storeStorage = importStoreStorage;
  @observable storeType = importStoreType;

  constructor () {
    autorun(() => {
      this.clear();
    });

    autorun(() => {
      this.setStorage(this.storeStorage.selectedKey);
    });
  }

  @computed get address (): string {
    return (this.wallet && this.wallet.address) || NULL_ADDRESS;
  }

  @computed get hasError (): boolean {
    return (this.shouldVerifyPassword && this.hasEmptyPassword) ||
      (this.shouldVerifyJson && this.hasJsonError) ||
      (this.shouldShowPhrase && this.hasEmptyPhrase) ||
      (this.shouldVerifyKey && this.hasInvalidPrivateKey);
  }

  @computed get hasEmptyPassword (): boolean {
    return !this.password;
  }

  @computed get hasEmptyPhrase (): boolean {
    return !this.phrase.trim() ||
      (['bipPhrase'].includes(this.type) && !isMnemonicValid(this.phrase));
  }

  @computed get hasInvalidPrivateKey (): boolean {
    return !this.privateKey || this.privateKey.length !== 66 || !isHexValid(this.privateKey);
  }

  @computed get hasJsonError (): boolean {
    try {
      const object = JSON.parse(this.walletJson);

      return !object || !object.address || object.address.length !== 40;
    } catch (e) {
      return true;
    }
  }

  @computed get isGenerated (): boolean {
    return !!((this.wallet && this.wallet.privateKey) && (this.walletObject && this.walletObject.address));
  }

  @computed get isHardware (): boolean {
    return ['ledger', 'trezor'].includes(this.type);
  }

  @computed get hdpath (): string {
    switch (this.hdpathType) {
      case 'terzor':
        return getTrezorHDPath(this.chains.selected.chainId);

      case 'ledger':
      default:
        return getLedgerHDPath(this.chains.selected.chainId);
    }
  }

  @computed get hdpathType (): PathType {
    return this.storePath.selected.key;
  }

  @computed get shouldVerifyJson (): boolean {
    return this.type === 'json';
  }

  @computed get shouldVerifyKey (): boolean {
    return this.type === 'privateKey';
  }

  @computed get shouldVerifyPassword (): boolean {
    return this.shouldStore && !['json', 'ledger', 'trezor'].includes(this.type);
  }

  @computed get shouldShowPassword (): boolean {
    return !this.isHardware;
  }

  @computed get shouldShowPath (): boolean {
    return ['bipPhrase'].includes(this.type);
  }

  @computed get shouldShowPhrase (): boolean {
    return ['bipPhrase', 'brainPhrase'].includes(this.type);
  }

  @computed get shouldStore (): boolean {
    return this.storage === 'browser';
  }

  @computed get type (): ImportType {
    return this.storeType.selected.key;
  }

  @action addAccount = () => {
    this.accountsStore.addItem(this.shouldStore, this.walletObject, this.wallet.privateKey);
  }

  @action setBusy = (isBusy: boolean) => {
    this.isBusy = isBusy;
  }

  @action clear = () => {
    this.isBusy = false;
    this.jsonFilename = '';
    this.name = '';
    this.password = '';
    this.privateKey = '0x';
    this.phrase = '';
    this.walletJson = '';
    this.walletObject = {};
  }

  @action create = () => {
    if (!this.isBusy) {
      this.setBusy(true);

      (() => {
        switch (this.type) {
          case 'bipPhrase':
            return this.createWalletFromMnemonic();

          case 'brainPhrase':
            return this.createWalletFromPhrase();

          case 'json':
            return this.createWalletFromJson();

          case 'ledger':
            return this.createWalletFromLedger();

          case 'newKey':
            return this.createWalletNew();

          case 'privateKey':
            return this.createWalletFromKey();

          case 'trezor':
            return this.createWalletFromTrezor();

          default:
            throw new Error(`Unable to handle creation of ${this.type}`);
        }
      })()
        .then(() => {
          this.setState('completed');
          this.clear();
        })
        .catch((error: Error) => {
          this.setState('error');
          errors.addError(i18n.t('import:errors.importFail'), error);
        })
        .then(() => {
          this.setBusy(false);
        });
    }
  }

  @action setState = (state: StateType) => {
    this.state = state;
  }

  @action clearState = () => {
    this.setState('empty');
  }

  _setCreatedWallet = (keyObject: PrivateKeyType) => {
    this.setState('addAccount');
    this.setWalletObject(keyObject);
    this.addAccount();
  }

  _addFromWallet = (wallet: WalletType) => {
    this.setState('createKeyObject');
    this.setWallet(wallet);

    return createKeyObject(this.wallet.privateKey, this.password)
      .then(this._setCreatedWallet);
  }

  createWalletFromKey = () => {
    this.setState('walletFromPhrase');

    return walletFromPrivateKey(this.privateKey)
      .then(this._addFromWallet);
  }

  createWalletFromLedger = async () => {
    this.setState('commsLedger');

    const [address]: Array<string> = await getLedgerAddresses(this.chains.selected.chainId);

    if (!address) {
      throw new Error(i18n.t('import:errors.ledgerComms'));
    }

    this.setWalletObject({
      address,
      name: 'Ledger',
      meta: {
        hardware: {
          type: 'ledger'
        }
      }
    });
    this.setState('addAccount');
    this.addAccount();
  }

  createWalletFromTrezor = async () => {
    this.setState('commsTrezor');

    const [address]: Array<string> = await getTrezorAddresses(this.chains.selected.chainId);

    if (!address) {
      throw new Error(i18n.t('import:errors.trezorComms'));
    }

    this.setWalletObject({
      address,
      name: 'Trezor',
      meta: {
        hardware: {
          type: 'trezor'
        }
      }
    });
    this.setState('addAccount');
    this.addAccount();
  }

  createWalletFromMnemonic = () => {
    this.setState('walletFromPhrase');

    return walletFromMnemonic(this.phrase, this.hdpath)
      .then(this._addFromWallet);
  }

  createWalletFromPhrase = () => {
    this.setState('walletFromPhrase');

    return walletFromPhrase(this.phrase)
      .then(this._addFromWallet);
  }

  createWalletNew = () => {
    this.setState('createKeyObject');

    return newKeyObject(this.password)
      .then(this._setCreatedWallet);
  }

  createWalletFromJson = () => {
    this.setState('walletFromKeyObject');
    this.setWalletObject(JSON.parse(this.walletJson));

    return walletFromKeyObject(this.walletObject, this.password)
      .then((wallet: WalletType) => {
        this.setState('addAccount');
        this.setWallet(wallet);
        this.addAccount();
      });
  }

  @action setJsonFile = (filename: string, json: string) => {
    this.setJsonFilename(filename);
    this.setWalletJson(json);
  }

  @action setName = (name: string) => {
    this.name = name;
  }

  @action setPassword = (password: string) => {
    this.password = password;
  }

  @action setPhrase = (phrase: string) => {
    this.phrase = phrase.toLowerCase();
  }

  @action setPrivateKey = (privateKey: string) => {
    this.privateKey = privateKey;
  }

  @action setStorage = (storage: StorageType) => {
    this.storage = storage;
  }

  @action setWallet = (wallet: WalletType) => {
    this.wallet = wallet;
  }

  @action setJsonFilename = (filename: string) => {
    this.jsonFilename = filename;
  }

  @action setWalletJson = (walletJson: string) => {
    this.walletJson = walletJson;
  }

  @action setWalletObject = (walletObject: PrivateKeyType) => {
    const address: string = formatAddress(walletObject.address);

    if (this.wallet.address !== address) {
      this.wallet = { address };
    }

    this.walletObject = Object.assign({}, walletObject, {
      name: this.name || walletObject.name,
      meta: Object.assign(walletObject.meta || {}, {
        theBlock: {
          importedAt: Date.now()
        }
      })
    });
  }
}

export default new ImportStore();
