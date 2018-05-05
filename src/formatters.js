/* @flow */

// Don't use style `currency` because it always prints a currency symbol. Match Google Finance
// exactly (until supporting other currencies) and don't print the symbol.
export const currencyFormatter = new window.Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export const numberFormatter = new window.Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3,
});

export const percentFormatter = new window.Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: 'percent',
});
