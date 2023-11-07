export default ({ app }, inject) => {

  /**
   * @type {{subscribeBars(*, *, *, *): void, resolveSymbol(*, *): void, getBars(*, *, *, *): (boolean|undefined), getServerTime(*): void, $subscribers: {}, unsubscribeBars(*): void, getTimeScaleMarks(*, *, *, *, *): void, calculateHistoryDepth(*, *, *): *, record(*): void, $init: boolean, interval(*): *, send(*): Promise<*>, onReady(*): void}}
   */
  app.$datafeed = {

    $init: false,
    $subscribers: {},
    $decimal: 0,

    /**
     * @param cb
     */
    onReady(cb) {
      setTimeout(() => cb({
        supported_resolutions: ['1', '5', '15', '30', '1h', '1D']
      }), 0)
    },

    /**
     * @param unit
     * @param onSymbolResolvedCallback
     */
    resolveSymbol(unit, onSymbolResolvedCallback) {

      let resolved = {
        name: `${unit.split("-")[0] + '/' + unit.split("-")[1]}`,
        description: '',
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: `${unit.split("-")[0] + '-' + unit.split("-")[1]}`,
        minmov: 1,
        minmov2: 0,
        intraday_multipliers: ["1","5","15","30","60"],
        pricescale: 1000000,
        has_intraday: true,
        has_weekly_and_monthly: true,
        has_daily: true,
        volume_precision: 8,
        data_status: 'streaming'
      }

      switch (this.$decimal) {
        case 2:
          resolved.pricescale = 100;
          break
        case 4:
          resolved.pricescale = 10000;
          break
        case 6:
          resolved.pricescale = 1000000;
          break
        case 8:
          resolved.pricescale = 100000000;
          break
      }

      setTimeout(() => {
        onSymbolResolvedCallback(resolved)
      }, 0);
    },

    /**
     * @param symbolInfo
     * @param resolution
     * @param interval
     * @param onHistoryCallback
     */
    getBars(symbolInfo, resolution, interval, onHistoryCallback) {
      if (interval.countBack === undefined) {
        return false;
      }

      let symbol = symbolInfo.name.split('/');
      let query = {
        base_unit: symbol[0].toLowerCase(),
        quote_unit: symbol[1].toLowerCase(),
        resolution: this.interval(resolution),
        from: interval.from,
        to: interval.to,
      };

      this.send(query).then((response) => {

        let bars = [];
        let item = {};

        response.fields = response.fields ?? [];

        for (let i = response.fields.length - 1; i > 0; i--) {

          item.open = item.close ?? response.fields[i].open;
          item.high = response.fields[i].high;
          item.low = response.fields[i].low;
          item.close = response.fields[i].close;
          item.time = Number(response.fields[i].time) * 1000;
          item.volume = response.fields[i].volume ?? NaN;

          bars.push(Object.assign({}, item));
        }

        onHistoryCallback(bars.length ? bars : [], {noData: !bars.length});
      });

      if (!this.$init) {

        /**
         * Отслеживаем события бегущей строки, данные об торгах.
         * @return {callback}:
         * @object {base_unit: string},
         * @object {close: float},
         * @object {high: float},
         * @object {low: float},
         * @object {open: float},
         * @object {price: float},
         * @object {quote_unit: string},
         * @object {time: int}
         */
        app.$publish.bind('trade/ticker:' + query.resolution, (data) => {
          if (data.fields !== undefined && symbol[0].toLowerCase() === data.fields[0].base_unit && symbol[1].toLowerCase() === data.fields[0].quote_unit) {
            this.record(data.fields[0]);
          }
        });

        this.$init = true;
      }
    },

    /**
     * @param symbolInfo
     * @param resolution
     * @param onRealtimeCallback
     * @param subscriberUID
     */
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
      if (this.$subscribers[subscriberUID]) {
        return;
      }
      this.$subscribers[subscriberUID] = {
        lastBarTime: null,
        listener: onRealtimeCallback,
        resolution: resolution,
        symbolInfo: symbolInfo,
      };
      this.$init = false;
    },

    /**
     * @param subscriberUID
     */
    unsubscribeBars(subscriberUID) {
      if (!this.$subscribers[subscriberUID]) {
        return;
      }

      app.$publish.unbind(['trade/ticker:' + this.interval(this.$subscribers[subscriberUID].resolution)]);
      delete this.$subscribers[subscriberUID];
    },

    /**
     * @param symbolInfo
     * @param startDate
     * @param endDate
     * @param onDataCallback
     * @param resolution
     */
    getTimeScaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {
      console.log('=====getTimeScaleMarks running', symbolInfo, resolution)
    },

    /**
     * @param resolution
     * @param resolutionBack
     * @param intervalBack
     * @returns {*}
     */
    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
      return this.interval(resolution)
    },

    /**
     * @param callback
     */
    getServerTime(callback) {
      app.$axios.$get(app.$api.timestamp).then((response) => {
        callback(response);
      });
    },

    /**
     * @param resolution
     * @returns {*}
     */
    interval(resolution) {
      const interval = {
        '1': 60,      // 1 minutes
        '5': 300,     // 5 minutes
        '15': 900,    // 15 minutes
        '30': 1800,   // 30 minutes
        '1h': 3600,   // 1 hour
        '1D': 86400   // 1 day
      };

      if (interval[resolution]) {
        return interval[resolution]
      }

      return interval[1]
    },

    /**
     * @param bar
     */
    record(bar) {
      for (let listenerGuid in this.$subscribers) {

        let record = this.$subscribers[listenerGuid];
        let time = record.lastBarTime;
        if (!bar) continue;

        bar.time = bar.time * 1000;
        bar.volume = bar.volume ?? NaN;

        if (time !== null && bar.time < time) continue;

        record.listener(bar);
        record.lastBarTime = bar.time;
      }
    },

    /**
     * @param params
     * @returns {Promise<any>}
     * @private
     */
    send(params) {
      let request = app.$api.provider.getTicker;
      if (params) {
        for (let i = 0; i < Object.keys(params).length; ++i) {
          let key = Object.keys(params)[i];
          let value = encodeURIComponent(params[key]);
          request += (i === 0 ? '?' : '&') + key + '=' + value;
        }
      }

      return app.$axios.$get(request);
    }

  };
  inject('datafeed', app.$datafeed);
};