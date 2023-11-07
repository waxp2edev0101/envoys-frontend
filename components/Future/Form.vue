<template>
  <v-card :disabled="!status && $auth.loggedIn" class="ma-1 rounded-lg" height="100%" elevation="0">

    <!-- Start: app bar element -->
    <v-app-bar color="transparent" height="50" flat>
      <v-tabs fixed-tabs :color="color" v-model="eyelet">
        <v-tab>
          {{ $vuetify.lang.t('open') }}
        </v-tab>
        <v-tab>
          {{ $vuetify.lang.t('close') }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <!-- End: app bar element -->

    <v-divider />

    <!-- Start: group button -->
    <v-card-actions>
      <v-item-group class="market--limit ma-2 mb-n2" v-model="trading">
        <v-item v-slot="{ active, toggle }">
          <v-chip :color="color" :active-class="color + '--text'" :input-value="active" @click="toggle" filter outlined label>
            {{ $vuetify.lang.t('$vuetify.lang_128') }}
          </v-chip>
        </v-item>
        <v-item v-slot="{ active, toggle }">
          <v-chip :color="color" :active-class="color + '--text'" :input-value="active" @click="toggle" filter outlined label>
            {{ $vuetify.lang.t('$vuetify.lang_24') }}
          </v-chip>
        </v-item>
      </v-item-group>
    </v-card-actions>
    <!-- End: group button -->

    <!-- Start: form order trade element -->
    <v-card-text>
      <template v-if="!trading">
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-text-field :disabled="!trading" :value="hover ? $vuetify.lang.t('$vuetify.lang_134') : '≈' + price" class="mb-4" color="primary" height="40" dense hide-details outlined :label="$vuetify.lang.t('$vuetify.lang_52')">
            <template v-slot:append>
              <span class="my-1">{{ parse.base().toUpperCase() }}/{{ parse.quote().toUpperCase() }}</span>
            </template>
          </v-text-field>
        </v-hover>
      </template>
      <template v-else>
        <v-text-field v-model="price" class="mb-4" color="primary" height="40" dense hide-details outlined :label="$vuetify.lang.t('$vuetify.lang_52')">
          <template v-slot:append>
            <span class="my-1">{{ parse.base().toUpperCase() }}/{{ parse.quote().toUpperCase() }}</span>
          </template>
        </v-text-field>
      </template>
      <v-text-field v-model="quantity" @focus="bind.quantity = true" class="mb-4" color="primary" height="40" dense hide-details outlined :label="$vuetify.lang.t('$vuetify.lang_53')">
        <template v-slot:append>
          <span class="my-1">{{ trading ? parse.base().toUpperCase() : (assigning === 'close' ? parse.base().toUpperCase() : parse.quote().toUpperCase()) }}</span>
        </template>
      </v-text-field>
      <!-- <v-text-field v-show="trading" v-model="value" @focus="bind.value = true" class="mb-4" color="primary" height="40" dense hide-details outlined :label="$vuetify.lang.t('$vuetify.lang_56')">
        <template v-slot:append>
          <span class="my-1">{{ trading ? parse.quote().toUpperCase() : (assigning === 'close' ? parse.quote().toUpperCase() : parse.base().toUpperCase()) }}</span>
        </template>
      </v-text-field> -->

      <v-component-range-slider :eyelet="eyelet" :clear="clear" @input="setPercent" />
    </v-card-text>
    <!-- End: form order trade element -->

    <v-divider />
    <!-- Start: leverage form -->
    <v-component-leverage-card :value="leverage" @set-leverage="leverage=$event"/>
    <!-- End: leverage form -->
    <v-divider />

    <!-- Start: threshold board -->
    <v-component-threshold-card v-if="assigning === $constants.directions.Open" :position="position" :threshold="threshold" @set-position="position=$event" @set-threshold="threshold=$event"/>
    <!-- End: threshold board -->

    <!-- Start: create new order element -->
    <v-card-actions>
      <div class="d-flex flex-fill ma-2" style="gap: 8px">
        <v-btn @click="setOrder($constants.positions.Long)" :color="(assigning === $constants.directions.Open ? 'teal lighten-2 white--text' : 'red lighten-2 white--text')" large elevation="0" class="flex-grow-1">
          {{ assigning === $constants.directions.Open ? $vuetify.lang.t('buy long') : $vuetify.lang.t('close long') }}
        </v-btn>
        <v-btn @click="setOrder($constants.positions.Short)" :color="(assigning === $constants.directions.Open ? 'red lighten-2 white--text' : 'teal lighten-2 white--text')" large elevation="0" class="flex-grow-1">
          {{ assigning === $constants.directions.Open ? $vuetify.lang.t('sell short') : $vuetify.lang.t('close short') }}
        </v-btn>
      </div>
    </v-card-actions>
    <!-- End: create new order element -->

    <v-divider />

    <v-card-text>
      <div :class="(trading ? 'my-6' : 'my-13') + ' subtitle-1 text-center'">
        <template v-if="$decimal.format(balance, 8)">
          <div :class="$vuetify.theme.dark ? 'grey--text' : ''">
            {{ $decimal.format(balance, 8) }} {{ String(symbol).toUpperCase() }}
          </div>
        </template>
        <template v-else>
          <div :class="$vuetify.theme.dark ? 'grey--text' : ''">
            0 {{ String(symbol).toUpperCase() }}
          </div>
        </template>
      </div>
    </v-card-text>

    <!--Start: Purchase assets -->

    <v-component-purchase-card />
    <!--End: Purchase assets -->
    <!--Start: Future trading information -->

    <v-component-future-info-card />

    <!--End: Future trading information -->
    <template v-if="!$auth.loggedIn">
      <v-overlay :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" absolute>
        <v-btn color="black--text yellow darken-1 text-capitalize" to="/signin" large elevation="0">{{ $vuetify.lang.t('$vuetify.lang_29') }}</v-btn>
      </v-overlay>
    </template>
    <template v-else>
      <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
        <v-progress-circular color="yellow darken-3" indeterminate size="50" />
      </v-overlay>
    </template>

  </v-card>
</template>

<script>

  import Range from "../Default/Range.vue";
  import Leverage from "./Form/Leverage.vue";
  import Purchase from "./Form/Purchase.vue";
  import Threshold from "./Form/Threshold.vue";
  import FutureInfo from "./Form/FutureInfo.vue";

  export default {
    name: "v-component-future-form",
    components: {
      'v-component-range-slider': Range,
      'v-component-leverage-card': Leverage,
      'v-component-future-info-card': FutureInfo,
      'v-component-threshold-card': Threshold,
      'v-component-purchase-card': Purchase,
    },
    data() {
      return {
        eyelet: 0,
        price: 0,
        value: 0,
        quantity: 0,
        balance: 0,
        status: 0,
        overlay: true,
        clear: false,
        trading: 1, // market or limit contract
        assigning: this.$constants.directions.Open, // open or close future
        position: this.$constants.positions.None, // long or short position 
        bind: {
          quantity: false,
          value: false
        },
        leverage: 1,
        threshold: { // threshold of trading
          profit: 0,
          loss: 0,
        },
        free: 0.00001,
      }
    },
    watch: {
      $route() {
        this.getAsset(true);
      },
      price(e) {
        if (e) {
          switch (this.assigning) {
            case this.$constants.directions.Open:
              this.quantity = this.$decimal.div(this.value, e);
              break;
            case this.$constants.directions.Close:
              this.value = this.$decimal.mul(this.quantity, e);
              break;
          }
        } else {
          this.price = 0;
        }
      },
      quantity(e) {
        if (this.bind.quantity) {
          this.value = this.$decimal.mul(e, this.price);
          this.bind.value = false;
        }
      },
      value(e) {
        if (this.bind.value) {
          this.quantity = this.$decimal.div(e, this.price);
          this.bind.quantity = false;
        }
      },
      trading() {
        this.quantity = 0;
        this.value = 0;
        this.clear = false;

        setTimeout(() => {
          this.clear = true;
        });
      },
      eyelet(e) {
        this.assigning = e ? this.$constants.directions.Close : this.$constants.directions.Open;
        this.getAsset(true);
      }
    },
    mounted() {

      /**
       * @event 'price/update'
       */
      this.$nuxt.$on('price/update', (price) => {
        this.price = price;
      });

      /**
       * Обновляем данные актива.
       * @event 'order/cancel'
       */
      this.$nuxt.$on('order/cancel', () => {
        // Обновляем данные об активе, в нашем случае нам нужно обновить текущий баланс актива.
        this.getAsset(false);
      });

      /**
       * Отслеживаем события нового депозита.
       * @event 'deposit/open/status'
       * @return {callback}:
       */
      this.$nuxt.$on('deposit/open/status', (data) => {

        if (!this.$auth.loggedIn) {
          return false;
        }

        if (

            // Сверяем локальный штат пользователя
            // это у нас пользовательский [id] с полученным из события пользовательским [user_id],
            // если аргументы совпадают то это значит что ордер сработал частично или полностью.
            data.user_id === Number(this.$auth.$state.user.fields[0].id)

        ) {
          // Обновляем данные об активе, в нашем случае нам нужно обновить текущий баланс актива.
          this.getAsset(false);
        }
      });

      /**
       * Отслеживаем статус ордера.
       * @return {callback}:
       * @object {base_unit: string},
       * @object {id: int},
       * @object {assigning: string}
       * @object {price: float},
       * @object {quantity: float},
       * @object {quote_unit: string},
       * @object {create_at: int},
       * @object {user_id: int},
       * @object {value: float}
       */
      this.$publish.bind('order/status', (data) => {

        if (!this.$auth.loggedIn) {
          return false;
        }

        if (

          // Сверяем принадлежат ли новые события к данному активу,
          // если аргументы совпадают то привязываем полученные данные из события к данному активу.
          data.base_unit === this.parse.base() &&
          data.quote_unit === this.parse.quote()

        ) {

          // Обновляем данные об активе, в нашем случае нам нужно обновить текущий баланс актива.
          this.getAsset(false);
        }

      });

      /**
       * Отслеживаем события бегущей строки, данные об торгах.
       * @return {callback}:
       * @object {base_unit: string},
       * @object {close: float},
       * @object {high: float},
       * @object {low: float},
       * @object {open: float},
       * @object {quote_unit: string},
       * @object {time: int}
       */
      this.$publish.bind('trade/ticker:0', (data) => {
        if (data.fields) {
          if (

            // Сверяем принадлежат ли новые события к данному активу,
            // если аргументы совпадают то привязываем полученные данные из события к данному активу.
            data.fields.lastItem.base_unit === this.parse.base() &&
            data.fields.lastItem.quote_unit === this.parse.quote() &&

            // Не обновляем цену если тип по лимиту.
            !this.trading

          ) {
            this.price = data.fields[0].close;
          }
        }
      });

      this.getAsset(false);
    },
    methods: {

      /**
       * Получаем новые данные бегущей строки, данные об торгах.
       */
      getPrice() {
        this.$axios.$get(this.$api.provider.getPrice + '?base_unit=' + this.parse.base() + '&quote_unit=' + this.parse.quote()).then((response) => {
          this.price = response.price ?? 0;
        })
      },

      /**
       * Получаем данные об активе.
       * @param overlay
       * @returns {boolean}
       */
      getAsset(overlay) {

        this.getPrice();

        if (overlay) {
          this.overlay = true;
        }

        if (!this.$auth.loggedIn) {
          return false;
        }

        this.$axios.$post(this.$api.provider.getAsset, {symbol: this.symbol, type: 'spot'}).then((response) => {
          // После перехода на новый актив обнуляем все параметры.
          this.balance = 0;
          this.value = 0;
          this.quantity = 0;
          this.clear = true;

          if (response.fields !== undefined) {
            if (response.fields[0].balance !== undefined) {
              this.balance = (response.fields[0].balance).toFixed(8) > 0 ? response.fields[0].balance : 0;
            }

            // Если в этого активе статус 1, то парного ему актива 0,
            // значит налаживаем вето на эту форму в целом.
            this.status = response.fields[0].status ?? 0;
            if (this.status) {
              this.$axios.$post(this.$api.provider.getPair, {base_unit: this.parse.base(), quote_unit: this.parse.quote()}).then((response) => {
                this.status = response.fields[0].status ?? 0;
              }).catch(e => {
                console.log(e)
              });
            }
          }

          this.overlay = false;
        });
      },

      /**
       * Перезаписываем поле [value] по принципу процентной ставки от баланса.
       * @param percent
       */
      setPercent(percent) {
        switch (this.assigning) {
          case 'open':

            if (this.trading) {
              this.value = this.$decimal.mul(this.balance, Number(percent) === 100 ? Number(percent)-this.free : Number(percent)) / 100;
              this.quantity = this.$decimal.div(this.value, this.price);
            } else {
              this.quantity = this.$decimal.mul(this.balance, Number(percent) === 100 ? Number(percent)-this.free : Number(percent)) / 100;
            }

            break;
          case 'close':
            this.value = this.$decimal.mul((this.$decimal.mul(this.balance, Number(percent) === 100 ? Number(percent)-this.free : Number(percent)) / 100), this.price);
            this.quantity = this.$decimal.div(this.value, this.price);
            break;
        }
      },

      validate() {
        const margin = this.price * this.quantity / this.leverage;
        
        return margin <= this.balance && this.price > 0 && Number(this.quantity) > 0
      },
      /**
       * Создаём новый ордер.
       */
      setOrder(pos) {
        this.clear = false;

        if (this.position !== this.$constants.positions.None && this.position !== pos) {
          this.$snackbar.open({
            content: `Only ${this.assigning} ${this.position} positions allowed`,
            color: 'red darken-2'
          })
          return;
        }
        this.position = pos;
        if (!this.validate()) {
          this.$snackbar.open({
            content: `Invalid data`,
            color: 'red darken-2',
          })
          return
        }
        const data = {
          "assigning": this.assigning,
          "base_unit": this.parse.base(),
          "quote_unit": this.parse.quote(),
          // "trading": this.trading ? 'limit' : 'market',
          "order_type": this.trading ? 'limit' : 'market',
          "quantity": Number(this.quantity),
          "price": this.price,
          "leverage": Number(this.leverage),
          "position": this.position,
          "take_profit": this.threshold.profit,
          "stop_loss": this.threshold.loss,
        }

        this.overlay = true;
        this.$axios.$post(this.$api.future.setOrder, {...data}).then((response) => {
          // Обновляем данные об активе, в нашем случае нам нужно обновить текущий баланс актива.
          this.getAsset(false);
          // Озвучиваем действие звуковым сопровождением.
          this.$single.play('create');
          this.overlay = false;

          this.$snackbar.open({content: `Order succeed`, color: 'green darken-2'});

        }).catch((error) => {
          this.overlay = false;
          this.$snackbar.open({content: `${error.response.data.code}: ${error.response.data.message}`, color: 'red darken-2'});
        });
        this.leverage = 1
        this.quantity = 0
        this.position = this.$constants.positions.None
      },
    },
    computed: {

      /**
       * @returns {string}
       */
      symbol() {
        switch (this.assigning) {
          case 'open':
            return this.parse.quote();
          case 'close':
            return this.parse.base();
        }
      },

      /**
       * @returns {{quote: (function(): string), base: (function(): string)}}
       */
      parse() {
        return {
          base: () => {
            return this.$route.params.unit.split('-')[0]
          },
          quote: () => {
            return this.$route.params.unit.split('-')[1]
          }
        }
      },

      /**
       * @returns {string}
       */
      color() {
        switch (this.eyelet) {
          case 0:
            return 'teal'
          case 1:
            return 'red';
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

  .market--limit {
    width: 100%;
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;

    span {
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 8px;
      flex: 1;
      cursor: pointer;
      color: #484848;
    }
  }

</style>
