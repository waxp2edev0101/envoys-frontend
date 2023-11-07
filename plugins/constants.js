export default ({ app }, inject) => {
    app.$constants = {
        positions: {
            None: 'none',
            Long: 'long',
            Short: 'short'
        },
        directions: {
            None: 'none',
            Open: 'open',
            Close: 'close',
        },
        assigning: {
            Buy: 'buy',
            Sell: 'sell',
        }
    };
    inject('constants', app.$constants)
}
