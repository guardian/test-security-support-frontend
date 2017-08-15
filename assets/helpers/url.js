// @flow

// ----- Routes ----- //

const routes = {
  recurringContribCheckout: '/contribute/recurring',
  recurringContribThankyou: '/contribute/recurring/thankyou',
  recurringContribCreate: '/contribute/recurring/create',
  oneoffContribCheckout: '/contribute/one-off',
  oneoffContribThankyou: '/contribute/one-off/thankyou',
  oneoffContribAutofill: '/contribute/one-off/autofill',
  payPalSetupPayment: '/paypal/setup-payment',
  payPalCreateAgreement: '/paypal/create-agreement',
};


// ----- Functions ----- //

const getQueryParameter = (paramName: string, defaultValue?: string): ?string => {

  const params = new URLSearchParams(window.location.search.toLowerCase());

  return params.get(paramName.toLowerCase()) || defaultValue;

};

const addQueryParamToURL = (urlOrPath: string, paramsKey: string, paramsValue: ?string): string => {

  // We are interested in the query params i.e. the part after the '?'
  const strParts = urlOrPath.split('?');

  // Save the first part of the urlOrPath and drop it from the strParts array.
  const strInit = strParts.shift();

  // I concatenate the rest of the array's values since all of them are query params.
  const params = strParts.reduce((a, b) => `${a}?${b}`, '');

  // Add the new param to the list of params.
  const paramsObj = new URLSearchParams(params);

  if (paramsValue !== undefined && paramsValue !== null) {
    paramsObj.set(paramsKey, paramsValue);
  }

  return `${strInit}?${paramsObj.toString()}`;
};


// ----- Exports ----- //

export {
  routes,
  getQueryParameter,
  addQueryParamToURL,
};
