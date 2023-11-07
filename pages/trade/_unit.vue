<template>
  <v-card class="ma-1 rounded-lg" elevation="0" height="500">

    <template v-if="status && count >= 60">

      <!-- Start: trading view -->
      <v-app-bar class="toolbar-px-zero rounded-lg" color="transparent" flat height="50">
        <v-slide-group multiple show-arrows>
          <v-slide-item>
            <div class="d-flex">
              <ul class="header-line">
                <li>{{ parse.symbol().toUpperCase() }}</li>
                <li v-if="header.last">
                  <small :class="priceConcurrency + '--text'">
                    <v-icon v-if="priceConcurrency === 'red'" :class="priceConcurrency + '--text'" small>
                      mdi-call-received
                    </v-icon>
                    <v-icon v-else-if="priceConcurrency === 'teal'" :class="priceConcurrency + '--text'" small>
                      mdi-call-made
                    </v-icon>
                    <v-icon v-else small>
                      mdi-keyboard-tab
                    </v-icon>
                    {{ $decimal.format(priceLast) }}
                  </small>
                </li>
              </ul>
              <div class="pl-2">
                <v-component-future-market-menu />
              </div>
            </div>
          </v-slide-item>
          <v-slide-item>
            <v-divider class="mx-3" vertical />
          </v-slide-item>
          <v-slide-item>
            <ul class="header-line">
              <li><small>{{ $vuetify.lang.t('$vuetify.lang_66') }}</small></li>
              <li v-if="header.last">
                <small :class="changeColor">{{ change24h }} {{ ratio24h }}%</small>
              </li>
            </ul>
          </v-slide-item>
          <v-slide-item>
            <div class="mx-3"></div>
          </v-slide-item>
          <v-slide-item>
            <ul class="header-line">
              <li><small>{{ $vuetify.lang.t('$vuetify.lang_67') }}</small></li>
              <li v-if="header.last">
                <small class="grey--text">{{ $decimal.format(maxPrice24h) }}</small>
              </li>
            </ul>
          </v-slide-item>
          <v-slide-item>
            <div class="mx-3"></div>
          </v-slide-item>
          <v-slide-item>
            <ul class="header-line">
              <li><small>{{ $vuetify.lang.t('$vuetify.lang_68') }}</small></li>
              <li v-if="header.last">
                <small class="grey--text">{{ $decimal.format(minPrice24h) }}</small>
              </li>
            </ul>
          </v-slide-item>
          <v-slide-item>
            <div class="mx-3"></div>
          </v-slide-item>
          <v-slide-item>
            <ul class="header-line">
              <li><small>{{ $vuetify.lang.t('$vuetify.lang_69') }}({{ this.parse.base().toUpperCase() }})</small></li>
              <li v-if="header.last">
                <small class="grey--text">{{ $decimal.format(volume24h) }}</small>
              </li>
            </ul>
          </v-slide-item>
          <v-slide-item>
            <div class="mx-3"></div>
          </v-slide-item>
          <v-slide-item>
            <ul class="header-line">
              <li><small>{{ $vuetify.lang.t('$vuetify.lang_69') }}({{ this.parse.base().toUpperCase() }})</small></li>
              <li v-if="header.last">
                <small class="grey--text">{{ $decimal.format($decimal.mul(volume24h, minPrice24h)) }}</small>
              </li>
            </ul>
          </v-slide-item>
        </v-slide-group>
      </v-app-bar>
      <!-- End: trading view -->

      <v-divider/>

    </template>
    <template v-else-if="!overlay">
      <v-layout class="bg-image" fill-height wrap>
        <v-flex/>
        <v-flex align-self-center class="text-center grey--text" md4 mx5 sm6 xl3>
          <template v-if="status && count <= 60">
            {{ $decimal.format(( count / 60 ) * 100) }} %
            <v-progress-linear :value="( count / 60 ) * 100" color="primary" />
          </template>
          <template v-else>
            <div>
              <v-icon color="grey">
                mdi-alert-circle-outline
              </v-icon>
            </div>
            <div>
              {{ $vuetify.lang.t('$vuetify.lang_213') }}
            </div>
          </template>
        </v-flex>
        <v-flex/>
      </v-layout>
    </template>

    <div v-show="status && count >= 60" id="charting-library" class="pa-2 charting" style="height: 448px"></div>
    <v-overlay :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" :value="overlay" absolute opacity="0.8">
      <v-progress-circular color="yellow darken-3" indeterminate size="50"/>
    </v-overlay>

  </v-card>
</template>

<script>
  import FutureMarketMenu from '~/components/Menu/Future';

  export default {
    components: {
      'v-component-future-market-menu': FutureMarketMenu,
    },
    data() {
      return {
        overlay: true,
        header: {},
        status: false,
        openMenu: false,
      }
    },
    head() {
      return {
        title: (this.parse.symbol() ? this.parse.symbol().toUpperCase() : 'Loading') + ' | ' + (this.priceLast ? this.$decimal.format(this.priceLast, 0) : 0)
      }
    },
    watch: {
      $route() {
        this.getTicker();
      }
    },
    mounted() {
      this.getTicker();

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
      this.$publish.bind('trade/ticker:0', (data) => {
        if (data.fields !== undefined && this.parse.base() === data.fields[0].base_unit && this.parse.quote() === data.fields[0].quote_unit) {
          this.header = data.stats;
        }
      });
    },
    methods: {

      getTicker() {
        this.overlay = true;

        // Инициализируем шапку со статическими данными.
        this.getHeader();

        // Проверяем есть ли такая пара
        this.$axios.$post(this.$api[this.$route.query.type === 'stock' ? 'stock' : 'provider'].getPair, {base_unit: this.parse.base(), quote_unit: this.parse.quote()}).then((response) => {

          // Если статус пары false, то мы не инициализируем график.
          this.status = response.fields[0].status ?? false;
          if (this.status) {

            let params = this.$datafeed;
            params.$decimal = response.fields[0].quote_decimal;

            /**
             * @type {IChartingLibraryWidget}
             */
            window.tvWidget = new window.TradingView.widget({
              symbol: response.fields[0].base_unit.toUpperCase() + '-' + response.fields[0].quote_unit.toUpperCase(),
              theme: (this.$vuetify.theme.dark ? "Dark" : "Light"),
              locale: this.$vuetify.lang.current,
              container: 'charting-library',
              datafeed: params,
              interval: '15',
              library_path: '/js/charting_library/',
              disabled_features: [
                "use_localstorage_for_settings",
                "header_symbol_search",
                "symbol_search_hot_key",
                "header_undo_redo",
                "compare_symbol",
                "header_compare",
                "header_saveload",
              ],
              time_frames: [],
              client_id: 'tradingview.com',
              charts_storage_api_version: "1.1",
              user_id: 'public_user_id',
              fullscreen: false,
              autosize: true
            });
          }

          // Выполняем действия после того как график прогрузился.
          if (this.status) {
            setTimeout(() => {
              window.tvWidget.onChartReady(() => {
                this.overlay = false;
                window.tvWidget.chart().createStudy('MA Cross', false, false);
              });
            }, 1000);
          } else {
            this.overlay = false;
          }
        });
      },

      /**
       *
       */
      getHeader() {
        this.$axios.$get(this.$api.provider.getTicker + '?base_unit=' + this.parse.base() + '&quote_unit=' + this.parse.quote() + '&limit=2').then((response) => {
          this.header = response.stats;
        })
      }
    },
    computed: {

      /**
       * @returns {{quote: (function(): string), base: (function(): string)}}
       */
      parse() {
        return {
          symbol: () => {
            return this.$route.params.unit
          },
          base: () => {
            return this.$route.params.unit.split('-')[0]
          },
          quote: () => {
            return this.$route.params.unit.split('-')[1]
          }
        }
      },

      /**
       * @returns {number|*}
       */
      count() {
        if (this.header.count) {
          return this.header.count;
        }
        return 0;
      },

      /**
       * @returns {number|*}
       */
      priceLast() {
        if (this.header.last) {
          return this.header.last;
        }
        return 0;
      },

      /**
       * @returns {number|*}
       */
      priceFirst() {
        if (this.header.first) {
          return this.header.first;
        }
        return 0;
      },

      /**
       * @returns {number|*}
       */
      pricePrevious() {
        if (this.header.previous) {
          return this.header.previous;
        }
        return 0;
      },

      /**
       * @returns {string|string}
       */
      priceConcurrency() {

        if (this.priceLast > this.pricePrevious) {
          return 'teal'
        }
        if (this.priceLast < this.pricePrevious) {
          return 'red'
        }

        return this.$vuetify.theme.dark ? 'grey' : ''
      },

      /**
       * @returns {*}
       */
      volume24h() {
        if (this.header.volume) {
          return this.header.volume;
        }
        return 0;
      },

      /**
       * @returns {number}
       */
      maxPrice24h() {
        return this.header.high;
      },

      /**
       * @returns {number}
       */
      minPrice24h() {
        return this.header.low;
      },

      /**
       * @returns {string}
       */
      change24h() {
        let ratio = this.$decimal.sub(this.priceLast, this.priceFirst);
        if (Math.sign(ratio) === -1) {
          return (ratio).toFixed(2)
        }
        return `+${(ratio).toFixed(2)}`
      },

      /**
       * @returns {string}
       */
      ratio24h() {
        let ratio = (this.$decimal.sub(this.priceLast, this.priceFirst) / this.priceFirst) * 100;
        if (Math.sign(ratio) === -1) {
          return (ratio).toFixed(2)
        }
        return `+${(ratio).toFixed(2)}`
      },

      /**
       * @returns {string}
       */
      changeColor() {
        let ratio = this.$decimal.sub(this.priceLast, this.priceFirst);
        if (Math.sign(ratio) === -1) {
          return 'red--text'
        }
        return 'teal--text'
      }
    },

    /**
     *
     */
    beforeDestroy() {
      window.tvWidget = undefined;
    }
  }
</script>

<style scoped>

  .bg-image::after {
    content: "";
    width: 100%;
    height: 100%;
    background-image: url(/asset/4.png);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    position: absolute;
    display: block;
    opacity: 0.1;
  }

</style>