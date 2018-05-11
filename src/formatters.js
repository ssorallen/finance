/* @flow */

const bigNumberFormatter = new window.Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const POWER_SUFFIXES = ['', 'K', 'M', 'B', 'T'];
export const abbreviatedNumberFormatter = {
  format(num: number, fixed?: number) {
    if (num === null || num === 0) return '0'; // terminate early

    fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
    const b = num.toPrecision(2).split('e'); // get power
    const k = b.length === 1 ? 0 : Math.floor(Math.min(parseInt(b[1].slice(1), 10), 14) / 3); // floor at decimals, ceiling at trillions
    const d = k < 0 ? k : Math.abs(k); // enforce -0 is 0
    const c = d < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
    return `${bigNumberFormatter.format(c)}${POWER_SUFFIXES[k]}`; // append power
  },
};

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
