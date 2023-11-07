export default ({app}, inject) => {

  /**
   * @type {{get(*): {color: string, name: string, tag: string}, list: [{color: string, name: string, tag: string},{color: string, name: string, tag: string},{color: string, name: string, tag: string},{color: string, name: string, tag: string},{color: string, name: string, tag: string},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], getTag(*): {color: string, name: string, tag: string}[]}}
   */
  app.$protocol = {
    list: [

      {name: 'mainnet', tag: 'tag_none', color: 'teal lighten-4'},

      // Ethereum.
      {name: 'erc20', tag: 'tag_ethereum', color: 'deep-purple lighten-4'},
      {name: 'erc721', tag: 'tag_ethereum', color: 'pink lighten-4'},
      {name: 'erc1155', tag: 'tag_ethereum', color: 'purple lighten-4'},
      {name: 'erc998', tag: 'tag_ethereum', color: 'red lighten-4'},
      {name: 'erc223', tag: 'tag_ethereum', color: 'cyan lighten-4'},

      // Binance smart chain.
      {name: 'bep20', tag: 'tag_binance', color: 'blue lighten-4'},
      {name: 'bep721', tag: 'tag_binance', color: 'teal lighten-4'},
      {name: 'bep1155', tag: 'tag_binance', color: 'green lighten-4'},
      {name: 'bep998', tag: 'tag_binance', color: 'light-blue lighten-5'},
      {name: 'bep223', tag: 'tag_binance', color: 'blue lighten-5'},

      // Tron.
      {name: 'trc20', tag: 'tag_tron', color: 'lime lighten-4'},
      {name: 'trc721', tag: 'tag_tron', color: 'amber lighten-4'},

      // Polygon.
      {name: 'prc20', tag: 'tag_polygon', color: 'lime lighten-5'},
      {name: 'prc721', tag: 'tag_polygon', color: 'amber lighten-5'},
      {name: 'prc1155', tag: 'tag_polygon', color: 'cyan lighten-5'},
      {name: 'prc998', tag: 'tag_polygon', color: 'red lighten-5'},
      {name: 'prc223', tag: 'tag_polygon', color: 'green lighten-5'},

      // Cronos.
      {name: 'crc20', tag: 'tag_cronos', color: 'purple lighten-5'},
      {name: 'crc721', tag: 'tag_cronos', color: 'teal lighten-5'},
      {name: 'crc1155', tag: 'tag_cronos', color: 'green lighten-5'},
      {name: 'crc998', tag: 'tag_cronos', color: 'light-green lighten-5'},
      {name: 'crc223', tag: 'tag_cronos', color: 'yellow lighten-5'},

      // Fantom.
      {name: 'frc20', tag: 'tag_fantom', color: 'amber lighten-5'},
      {name: 'frc721', tag: 'tag_fantom', color: 'deep-orange lighten-3'},
      {name: 'frc1155', tag: 'tag_fantom', color: 'light-blue lighten-3'},
      {name: 'frc998', tag: 'tag_fantom', color: 'red lighten-3'},
      {name: 'frc223', tag: 'tag_fantom', color: 'teal lighten-3'},

      // Avalanche.
      {name: 'arc20', tag: 'tag_avalanche', color: 'blue lighten-3'},
      {name: 'arc721', tag: 'tag_avalanche', color: 'cyan lighten-3'},
      {name: 'arc1155', tag: 'tag_avalanche', color: 'purple lighten-3'},
      {name: 'arc998', tag: 'tag_avalanche', color: 'pink lighten-3'},
      {name: 'arc223', tag: 'tag_avalanche', color: 'deep-purple lighten-3'},
    ],

    /**
     * @param name
     * @returns {{color: string, name: string, tag: string} | {color: string, name: string, tag: string} | {color: string, name: string, tag: string} | {color: string, name: string, tag: string} | {color: string, name: string, tag: string}}
     */
    get(name) {
      if (!name) {
        name = this.list[0].name;
      }

      return this.list.find((item) => item.name === name)
    },

    /**
     * @param tag
     * @returns {({color: string, name: string, tag: string}|{color: string, name: string, tag: string}|{color: string, name: string, tag: string}|{color: string, name: string, tag: string}|{color: string, name: string, tag: string})[]}
     */
    getTag(tag) {
      return this.list.filter((item) => item.tag === tag)
    }
  };
  inject('protocol', app.$protocol);
};