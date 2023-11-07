export default ({app}, inject) => {

  /**
   * @type {{get(*): {symbol: string, color: string, name: string, id: number, group: string}, getGroup(*): {symbol: string, color: string, name: string, id: number, group: string}[], list: [{symbol: string, color: string, name: string, id: number, group: string},{symbol: string, color: string, name: string, id: number, group: string},{symbol: string, color: string, name: string, id: number, group: string},{symbol: string, color: string, name: string, id: number, group: string},{symbol: string, color: string, name: string, id: number, group: string}], getSymbol(*): *}}
   */
  app.$platform = {
    list: [
      {id: 0, group: 'crypto', name: 'bitcoin', symbol: 'BTC', color: 'lime lighten-4'},
      {id: 1, group: 'crypto', name: 'ethereum', symbol: 'ETH', color: 'teal lighten-4'},
      {id: 2, group: 'crypto', name: 'tron', symbol: 'TRX', color: 'green lighten-4'},
      {id: 3, group: 'fiat', name: 'visa', symbol: 'MULTI CURRENCY', color: 'blue lighten-4'},
      {id: 4, group: 'fiat', name: 'mastercard', symbol: 'MULTI CURRENCY', color: 'purple lighten-4'}
    ],

    /**
     * @param name
     * @returns {{symbol: string, color: string, name: string, id: number, group: string} | {symbol: string, color: string, name: string, id: number, group: string} | {symbol: string, color: string, name: string, id: number, group: string} | {symbol: string, color: string, name: string, id: number, group: string} | {symbol: string, color: string, name: string, id: number, group: string}}
     */
    get(name) {
      if (!name) {
        name = this.list[0].name;
      }

      return this.list.find((item) => item.name === name)
    },

    /**
     * @param name
     * @returns {*}
     */
    getSymbol(name) {
      if (!name) {
        name = this.list[0].name;
      }

      return this.list.find((item) => item.name === name).symbol
    },

    /**
     * @param name
     * @returns {({symbol: string, color: string, name: string, id: number, group: string}|{symbol: string, color: string, name: string, id: number, group: string}|{symbol: string, color: string, name: string, id: number, group: string}|{symbol: string, color: string, name: string, id: number, group: string}|{symbol: string, color: string, name: string, id: number, group: string})[]}
     */
    getGroup(name) {
      return this.list.filter((item) => item.group === name)
    }
  };
  inject('platform', app.$platform);
};