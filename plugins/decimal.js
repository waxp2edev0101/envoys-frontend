import Decimal from "decimal.js";

Decimal.set({ precision: 16 });
export default (context, inject) => {

  /**
   * @type {{div(*, *): number, add(*, *): number, sub(*, *): number, truncate(*, *): number, mul(*, *): number, isNumber(*): boolean, precision(*): number, format(*, *): (*|number)}}
   */
  context.$decimal = {

    /**
     * @param number
     * @param precision
     * @returns {number}
     */
    truncate(number, precision) {
      if (this.isNumber(number)) {
        return 0
      }

      if (String(number).split('e-').length === 2) {
        return 0
      }

      if (precision === undefined || precision === 0) {
        precision = this.precision(number);
      }

      return Number(new Decimal(number).toFixed(precision))
    },

    /**
     * @param number
     * @param to
     * @returns {number|Decimal}
     */
    mul(number, to) {
      if (this.isNumber(number)) {
        return 0
      }

      return new Decimal(number).mul(to);
    },

    /**
     * @param number
     * @param to
     * @returns {number|Decimal}
     */
    div(number, to) {
      if (this.isNumber(number)) {
        return 0
      }
      return new Decimal(number).div(to);
    },

    /**
     * @param number
     * @param to
     * @returns {number|Decimal}
     */
    sub(number, to) {
      if (this.isNumber(number)) {
        return 0
      }
      return new Decimal(number).sub(to);
    },

    /**
     * @param number
     * @param to
     * @returns {number|Decimal}
     */
    add(number, to) {
      if (this.isNumber(number)) {
        return 0
      }
      return new Decimal(number).plus(to);
    },

    /**
     * @param number
     * @returns {number}
     */
    precision(number) {
      if (this.isNumber(number)) {
        return 0
      }

      let nums = String(number).split('.');
      if (Number(nums[0]) > 0) {
        return 2
      }
      return 8
    },

    /**
     * @param number
     * @param precision
     * @returns {*|number}
     */
    format(number, precision) {
      if (precision === undefined || precision === 0) {
        precision = this.precision(number);
      }

      return number ? String(this.substr(number, precision ?? 2)).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0;
    },

    /**
     * @param number
     * @param precision
     * @returns {*|number|string}
     */
    substr(number, precision) {
      if (this.isNumber(number)) {
        return 0
      }

      if (String(number).split('e-').length === 2) {
        return new Decimal(number).toFixed(precision)
      }

      if (precision === undefined || precision === 0) {
        precision = this.precision(number);
      }

      let string = String(number).split('.')
      if (string.length === 2) {
        return `${string[0]}.${string[1].substring(0, precision)}`
      }

      return number
    },

    /**
     * @param number
     * @returns {boolean|boolean}
     */
    isNumber(number) {
      return number === '' || number === undefined || number === 0 || number === null || isNaN(Number(number));
    }
  };
  inject('decimal', context.$decimal);
};
