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
};
