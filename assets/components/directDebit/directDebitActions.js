// @flow

import * as storage from 'helpers/storage';
import { checkAccount } from './helpers/ajax';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

// ----- Types ----- //

export type Action =
  | { type: 'DIRECT_DEBIT_POP_UP_OPEN' }
  | { type: 'DIRECT_DEBIT_POP_UP_CLOSE' }
  | { type: 'DIRECT_DEBIT_UPDATE_SORT_CODE', sortCode: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', accountNumber: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', accountHolderName: string }
  | { type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION', accountHolderConfirmation: boolean }
  | { type: 'DIRECT_DEBIT_SET_FORM_ERROR', message: string }
  | { type: 'DIRECT_DEBIT_RESET_FORM_ERROR' };


// ----- Actions ----- //

const openDirectDebitPopUp = (): Action => {
  storage.setSession('paymentMethod', 'DirectDebit');
  return { type: 'DIRECT_DEBIT_POP_UP_OPEN' };
};

const closeDirectDebitPopUp = (): Action => ({ type: 'DIRECT_DEBIT_POP_UP_CLOSE' });

const updateSortCode = (sortCode: string): Action => ({ type: 'DIRECT_DEBIT_UPDATE_SORT_CODE', sortCode });

const updateAccountNumber = (accountNumber: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_NUMBER', accountNumber });

const updateAccountHolderName = (accountHolderName: string): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_NAME', accountHolderName });

const updateAccountHolderConfirmation = (accountHolderConfirmation: boolean): Action =>
  ({ type: 'DIRECT_DEBIT_UPDATE_ACCOUNT_HOLDER_CONFIRMATION', accountHolderConfirmation });

const setDirectDebitFormError = (message: string): Action =>
  ({ type: 'DIRECT_DEBIT_SET_FORM_ERROR', message });

const resetDirectDebitFormError = (): Action =>
  ({ type: 'DIRECT_DEBIT_RESET_FORM_ERROR' });


const payDirectDebitClicked: (callback) => Function = () => {

  return function (dispatch, getState) {
    const {
      bankSortCode,
      bankAccountNumber,
      accountHolderName,
      accountHolderConfirmation,
    } = getState().page.directDebit;

    const isTestUser: boolean = getState().page.user.isTestUser || false;
    const { csrf }: CsrfState = getState().page;

    dispatch(resetDirectDebitFormError());

    if (!accountHolderConfirmation) {
      dispatch(setDirectDebitFormError('You need to confirm that you are the account holder.'));
      return;
    }

    return checkAccount(bankSortCode, bankAccountNumber, accountHolderName, isTestUser, csrf)
      .then((response) => {
        if (!response.accountValid) {
          throw new Error('code1');
        }
      }).then(() => {
        callback();
      }).catch((e) => {
        let msg = '';
        switch(e.message) {
          case 'code1': msg = 'Your bank data is not ok, please check it and try again.';
          default:  msg = 'Your bank data is not ok, please check it and try again.';

        }
        dispatch(setDirectDebitFormError(msg));
      });

  };
};

// ----- Exports ----//

export {
  openDirectDebitPopUp,
  closeDirectDebitPopUp,
  updateSortCode,
  updateAccountNumber,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
  setDirectDebitFormError,
  resetDirectDebitFormError,
  payDirectDebitClicked,
};
