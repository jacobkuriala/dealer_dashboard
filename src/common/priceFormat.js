'use strict';
// TODO: Copied from wheels. Potentially add this to node_modules
import {isNil, isNumber, toInteger, toString} from 'lodash';

/*
 * @see http://stackoverflow.com/a/14428340
 */
function format (price, symbol, precision = 0) {
  if (!isNumber(price)) {
    return null;
  }
  symbol = isNil(symbol) ? '$' : symbol;
  const prefix = price < 0 ? '-' + symbol : symbol;
  const formatted = (Math.abs(price) / 100).toFixed(precision).replace(/./g, (char, index, price) => {
    return index && char !== '.' && ((price.length - index) % 3 === 0) ? ',' + char : char;
  });
  return prefix + formatted;
}

export default class PriceFormat {
  static defaultRound (price) {
    return format(price);
  }

  static noSymbolRound (price) {
    return format(price, '');
  }

  static defaultCents (price) {
    return format(price, null, 2);
  }

  static noSymbolCents (price) {
    return format(price, '', 2);
  }

  static extractNumber (value) {
    return toInteger(toString(value).replace(/[^\d.]+/g, '')) || 0;
  }

  /**
   * Rounds value down to closest int (ie: 5, 10, etc) - if value = 94 and int = 10, result is 100
   * @param {int} value
   * @param {int} int
   * @return {int} rounded value
   */
  static roundDownToInt (value, int) {
    if (!int) {
      return value;
    }
    return Math.floor(value / int) * int;
  }

  /**
   * Rounds value up to closest int (ie: 5, 10, etc) - if value = 94 and int = 10, result is 100
   * @param {int} value
   * @param {int} int
   * @return {int} rounded value
   */
  static roundUpToInt (value, int) {
    if (!int) {
      return value;
    }
    return Math.ceil(value / int) * int;
  }

  static perThousandLoan (rate, term) {
    const r = rate / 12;
    const n = term;
    const p = 100000; // $1k in cents
    if (rate) {
      return format(p * (r * Math.pow((1 + r), n) / (Math.pow((1 + r), n) - 1)), '$', 2);
    } else { // handle 0% interest rate
      return format(p/term, '$', 2);
    }
  }
};
