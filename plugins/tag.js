export default ({app}, inject) => {

  app.$tag = {
    list: [
      {name: 'tag_none'},
      {name: 'tag_bitcoin'},
      {name: 'tag_ethereum'},
      {name: 'tag_binance'},
      {name: 'tag_tron'},
      {name: 'tag_polygon'},
      {name: 'tag_cronos'},
      {name: 'tag_fantom'},
      {name: 'tag_avalanche'},
    ]
  }
  inject('tag', app.$tag);
};