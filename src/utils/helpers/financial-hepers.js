export default class FinancialHelpers {
  static currencyFormatted(amount) {
    let i = parseFloat(amount.replace ? amount.replace(',', '') : amount);
    if (isNaN(i)) { i = 0.00; }
    let minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + 0.005) * 100, 10);
    i /= 100;
    let s = String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') === (s.length - 2)) { s += '0'; }
    s = minus + s;
    return s;
  }
  static getConvertToAmount(amount) {
    let i = parseFloat(amount.replace ? amount.replace(',', '') : amount);
    if (isNaN(i)) { i = 0.00; }
    i = Math.abs(i);
    i = parseInt((i + 0.005) * 100, 10);
    i /= 100;
    return i;
  }
}
