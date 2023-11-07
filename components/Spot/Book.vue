<template>
  <v-card class="ma-1 rounded-lg" height="1008" elevation="0">

    <!-- Start: filter assigning tab element -->
    <v-app-bar color="transparent" height="50" flat>
      <template v-if="hover">
        <v-row no-gutters>
          <v-col cols="4">
            <small :class="$vuetify.theme.dark ? 'grey--text' : ''">{{ $vuetify.lang.t('$vuetify.lang_52') }}<b>({{ parse.quote().toUpperCase() }})</b></small>
          </v-col>
          <v-col class="text-right" cols="4">
            <small :class="$vuetify.theme.dark ? 'grey--text' : ''">{{ $vuetify.lang.t('$vuetify.lang_53') }}<b>({{ parse.base().toUpperCase() }})</b></small>
          </v-col>
          <v-col class="text-right" cols="4">
            <small :class="$vuetify.theme.dark ? 'grey--text' : ''">{{ $vuetify.lang.t('$vuetify.lang_56') }}<b>({{ parse.quote().toUpperCase() }})</b></small>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row justify="center" no-gutters>
          <v-col cols="6">
            <v-item-group v-model="eyelet">
              <v-item v-slot="{ active, toggle }">
                <v-icon :disabled="active" :input-value="active" @click="toggle">mdi-alpha-b-circle-outline</v-icon>
              </v-item>
              <v-item v-slot="{ active, toggle }">
                <v-icon :disabled="active" :input-value="active" @click="toggle">mdi-alpha-s-circle-outline</v-icon>
              </v-item>
              <v-item v-slot="{ active, toggle }">
                <v-icon :disabled="active" :input-value="active" @click="toggle">mdi-alpha-m-circle-outline</v-icon>
              </v-item>
            </v-item-group>
          </v-col>
          <v-col class="text-right" cols="6">
            <div>{{ $vuetify.lang.t('$vuetify.lang_305') }}</div>
          </v-col>
        </v-row>
      </template>
    </v-app-bar>
    <!-- End: filter assigning tab element -->

    <v-divider />

    <template v-if="eyelet === 2">

      <!-- Start: orders bid list element -->
      <template v-if="orders.bid().length">
        <v-virtual-scroll @mouseover="hover = true" @mouseleave="hover = false" class="overflow-y-hidden" bench="0" :items="orders.bid()" height="410" item-height="29">
          <template v-slot:default="{ item }">
            <v-component-shift-item :width="Number($decimal.div($decimal.mul(item.value, 100), item.quantity).toFixed(0))" assigning="buy" :key="item.id">
              <v-row style="cursor: pointer;" @click="addPriceToForm(item.price, order.base_decimal)" no-gutters>
                <v-col cols="4">
                  <span class="teal--text">{{ $decimal.format(item.price, order.quote_decimal) }}</span>
                </v-col>
                <v-col :class="'text-right ' + ($vuetify.theme.dark ? 'grey--text' : '')" cols="4">
                  {{ $decimal.format(item.value, order.base_decimal) }}
                </v-col>
                <v-col :class="'text-right ' + ($vuetify.theme.dark ? 'grey--text' : '')" cols="4">
                  {{ $decimal.format($decimal.mul(item.value, item.price), order.quote_decimal) }}
                </v-col>
              </v-row>
            </v-component-shift-item>
          </template>
        </v-virtual-scroll>
      </template>
      <template v-else-if="!overlay">
        <v-layout style="height: 410px" wrap>
          <v-flex/>
          <v-flex class="text-center mx-5" align-self-center>
            <div>
              <v-icon size="50">
                mdi-database-remove-outline
              </v-icon>
            </div>
            <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_62') }}</h4>
          </v-flex>
          <v-flex/>
        </v-layout>
      </template>
      <!-- End: orders bid list element -->

      <v-divider />
      <v-card-actions style="height: 80px;">

        <v-row class="text-center" no-gutters>
          <v-col cols="4">
            <v-chip outlined style="width: 100%;height: 60px;display: block;" :class="($vuetify.theme.dark ? 'teal darken-3' : 'teal lighten-5 teal--text')" label>
              <ul class="chip-marker">
                <li>{{ $vuetify.lang.t('$vuetify.lang_57') }}</li>
                <li><small>{{ orders.bid().length ? $decimal.truncate(orders.bid()[0].price, order.quote_decimal) : '0.00000000' }} {{ parse.quote().toUpperCase() }}</small></li>
              </ul>
            </v-chip>
          </v-col>
          <v-col class="px-2" cols="4">
            <v-chip outlined style="width: 100%;height: 60px;display: block;" :class="($vuetify.theme.dark ? 'grey darken-3' : priceConcurrency + ' lighten-5 ' + priceConcurrency + '--text')" label>
              <ul class="chip-marker">
                <li>
                  <v-icon small v-if="priceConcurrency === 'red'" :class="priceConcurrency + '--text'">
                    mdi-arrow-down
                  </v-icon>
                  <v-icon small v-else-if="priceConcurrency === 'teal'" :class="priceConcurrency + '--text'">
                    mdi-arrow-up
                  </v-icon>
                  <v-icon small v-else>
                    mdi-shield-star-outline
                  </v-icon>
                </li>
                <li><small :class="priceConcurrency + '--text'">{{ priceCurrent ? $decimal.format(priceCurrent) : '0.0000000' }} {{ parse.quote().toUpperCase() }}</small></li>
              </ul>
            </v-chip>
          </v-col>
          <v-col cols="4">
            <v-chip outlined style="width: 100%;height: 60px;display: block;" :class="($vuetify.theme.dark ? 'red darken-3' : 'red lighten-5 red--text')" label>
              <ul class="chip-marker">
                <li>{{ $vuetify.lang.t('$vuetify.lang_58') }}</li>
                <li><small>{{ orders.ask().length ? $decimal.truncate(orders.ask()[0].price, order.quote_decimal) : '0.00000000' }} {{ parse.quote().toUpperCase() }}</small></li>
              </ul>
            </v-chip>
          </v-col>
        </v-row>

      </v-card-actions>
      <v-divider />

      <!-- Start: orders ask list element -->
      <template v-if="orders.ask().length">
        <v-virtual-scroll @mouseover="hover = true" @mouseleave="hover = false" class="overflow-y-hidden" bench="0" :items="orders.ask()" height="410" item-height="29">
          <template v-slot:default="{ item }">
            <v-component-shift-item :width="Number($decimal.div($decimal.mul(item.value, 100), item.quantity).toFixed(0))" assigning="sell" :key="item.id">
              <v-row style="cursor: pointer;" @click="addPriceToForm(item.price, order.base_decimal)" no-gutters>
                <v-col cols="4">
                  <span class="red--text">{{ $decimal.format(item.price, order.quote_decimal) }}</span>
                </v-col>
                <v-col :class="'text-right ' + ($vuetify.theme.dark ? 'grey--text' : '')" cols="4">
                  {{ $decimal.format(item.value, order.base_decimal) }}
                </v-col>
                <v-col :class="'text-right ' + ($vuetify.theme.dark ? 'grey--text' : '')" cols="4">
                  {{ $decimal.format($decimal.mul(item.value, item.price), order.quote_decimal) }}
                </v-col>
              </v-row>
            </v-component-shift-item>
          </template>
        </v-virtual-scroll>
      </template>
      <template v-else-if="!overlay">
        <v-layout style="height: 410px" wrap>
          <v-flex/>
          <v-flex class="text-center mx-5" align-self-center>
            <div>
              <v-icon size="50">
                mdi-database-remove-outline
              </v-icon>
            </div>
            <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_62') }}</h4>
          </v-flex>
          <v-flex/>
        </v-layout>
      </template>
      <!-- End: orders ask list element -->

    </template>
    <template v-else>

      <!-- Start: orders list element -->
      <template v-if="orders.assigning().length">
        <v-virtual-scroll @mouseover="hover = true" @mouseleave="hover = false" :class="hover ? '' : 'overflow-y-hidden'" bench="0" :items="orders.assigning()" height="900" item-height="29">
          <template v-slot:default="{ item }">
            <v-component-shift-item :width="Number($decimal.div($decimal.mul(item.value, 100), item.quantity).toFixed(0))" :assigning="item.assigning" :key="item.id">
              <v-row style="cursor: pointer;" @click="addPriceToForm(item.price, order.base_decimal)" no-gutters>
                <v-col cols="4">
                  <span :class="(item.assigning === 'sell' ? 'red' : 'teal') + '--text'">{{ $decimal.format(item.price, order.quote_decimal) }}</span>
                </v-col>
                <v-col :class="'text-right ' + ($vuetify.theme.dark ? 'grey--text' : '')" cols="4">
                  {{ $decimal.format(item.value, order.base_decimal) }}
                </v-col>
                <v-col :class="'text-right ' + ($vuetify.theme.dark ? 'grey--text' : '')" cols="4">
                  {{ $decimal.format($decimal.mul(item.value, item.price), order.quote_decimal) }}
                </v-col>
              </v-row>
            </v-component-shift-item>
          </template>
        </v-virtual-scroll>
      </template>
      <template v-else-if="!overlay">
        <v-layout style="height: 900px" wrap>
          <v-flex/>
          <v-flex class="text-center mx-5" align-self-center>
            <div>
              <v-icon size="50">
                mdi-database-remove-outline
              </v-icon>
            </div>
            <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_62') }}</h4>
          </v-flex>
          <v-flex/>
        </v-layout>
      </template>
      <!-- End: orders list element -->

    </template>

    <!-- Start: tool bar element -->
    <v-divider />
    <v-card-actions style="height: 56px;">

      <v-row justify="center" no-gutters>
        <v-col cols="6">
          <v-icon class="mx-1" :disabled="!order.range" @click="order.range = false" :color="$vuetify.theme.dark ? '' : 'grey darken-1'">
            mdi-sort
          </v-icon>
          <v-icon class="mx-1" :disabled="order.range" @click="order.range = true" :color="$vuetify.theme.dark ? '' : 'grey darken-1'">
            mdi-sort-descending
          </v-icon>
        </v-col>
        <v-col class="text-right" cols="6">
          <div class="mx-1">{{ $vuetify.lang.t('$vuetify.lang_304') }} {{ priceCurrent ? $decimal.format(order.volume) : 0 }} {{ parse.base().toUpperCase() }}</div>
        </v-col>
      </v-row>

    </v-card-actions>
    <!-- End: tool bar element -->

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </v-card>
</template>

<script>
  import ShiftItem from "../Default/ShiftItem.vue";

  export default {
    name: "v-component-spot-book",
    components: {
      'v-component-shift-item': ShiftItem
    },
    data() {
      return {
        hover: false,
        overlay: true,
        eyelet: 2,
        order: {
          range: false,
          base_decimal: 2,
          quote_decimal: 8,
          items: [],
          volume: 0
        }
      }
    },
    watch: {
      $route() {
        this.getOrders(null);
      },
      eyelet(e) {
        let assigning = null;
        switch (e) {
          case 0:
            assigning = "buy";
            break
          case 1:
            assigning = "sell";
            break
        }
        this.getOrders(assigning)
      }
    },

    mounted() {
      this.getOrders(null);

      /**
       * Отслеживаем события нового ордера.
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
      this.$publish.bind('order/create', (data) => {
        let assigning = (this.eyelet ? 'sell' : 'buy');
        if (

          // Сверяем принадлежат ли новые события к данному активу,
          // если аргументы совпадают то привязываем полученные данные из события к данному активу.
          data.base_unit === this.parse.base() &&
          data.quote_unit === this.parse.quote() &&

          // Добавляем елемент у видимую область.
          assigning === data.assigning ||
          this.eyelet === 2

        ) {

          this.order.items.unshift(Object.assign({}, data));

          if (this.order.items.length > 200) {
            this.order.items.splice(-1)
          }

          // Получаем текущий объем в ордерах.
          this.getVolume(assigning);
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

        let index = this.order.items.map((o) => Number(o.id)).indexOf(data.id);
        let matching = this.order.items.some((o) => Number(o.id) === data.id);

        if (

          // Проверяем есть ли в массиве объект по идентификатору.
          matching

        ) {

          switch (data.status) {
            case "filled":

              // Удаляем ордер с массива по идентификатору.
              this.order.items.splice(index, 1);

              break;
            case "pending":

              // Обновляем количество монет ордера.
              this.order.items[index].value = data.value;

              break

          }
          let assigning = (this.eyelet ? 'sell' : 'buy');

          // Получаем текущий объем в ордерах.
          this.getVolume(assigning);

        }
      });

      /**
       * Отслеживаем события удаленного ордера.
       * @return {callback}:
       * @object {base_unit: string},
       * @object {id: int},
       * @object {price: float},
       * @object {quantity: float},
       * @object {quote_unit: string},
       * @object {create_at: int},
       * @object {user_id: int},
       * @object {value: float},
       */
      this.$publish.bind('order/cancel', (data) => {

        // Удаляем ордер с массива по идентификатору.
        let index = this.order.items.map((o) => Number(o.id)).indexOf(data.id);
        if (index !== -1) {
          this.order.items.splice(index, 1);
        }
        let assigning = (this.eyelet ? 'sell' : 'buy');

        // Получаем текущий объем в ордерах.
        this.getVolume(assigning);
      });
    },

    methods: {

      /**
       *
       */
      getPair() {
        this.$axios.$post(this.$api.provider.getPair, {base_unit: this.parse.base(), quote_unit: this.parse.quote()}).then((response) => {
          this.order.base_decimal = response.fields[0].base_decimal ?? 2;
          this.order.quote_decimal = response.fields[0].quote_decimal ?? 8;
        });
      },

      /**
       * @param assigning
       */
      getOrders(assigning) {
        this.overlay = true;

        this.getPair();

        this.$axios.$post(this.$api.provider.getOrders, {
          // Назначение [sell:1] - [buy:0].
          assigning: assigning,
          // Имя актива (symbol-base).
          base_unit: this.parse.base(),
          // Имя актива (symbol-quote).
          quote_unit: this.parse.quote(),
          // Показывать записи если они со статусом в ожидании.
          status: "pending",
          // Count item.
          limit: 200
        }).then((response) => {
          this.order.volume = response.volume ?? 0;
          this.order.items = response.fields ?? [];
          this.overlay = false;
        });
      },

      /**
       * @param assigning
       */
      getVolume(assigning) {
        this.$axios.$post(this.$api.provider.getOrders, {
          // Назначение [sell:1] - [buy:0].
          assigning: assigning,
          // Имя актива (symbol-base).
          base_unit: this.parse.base(),
          // Имя актива (symbol-quote).
          quote_unit: this.parse.quote(),
          // Показывать записи если они со статусом в ожидании.
          status: "pending",
          // Количество объектов для вывода.
          limit: 1
        }).then((response) => {
          this.order.volume = response.volume ?? 0;
        });
      },

      /**
       * @param price
       */
      addPriceToForm(price) {
        this.$nuxt.$emit("price/update", price)
      }
    },

    computed: {

      /**
       * @returns {{ask: (function(): *[]), bid: (function(): *[]), assigning: (function(): *[])}}
       */
      orders() {
        return {
          assigning: () => {
            return this.order.items.filter((item) => item.assigning === (this.eyelet ? 'sell' : 'buy')).sort((a, b) => this.order.range ? b.price - a.price : null);
          },
          bid: () => {
            return this.order.items.filter((item) => item.assigning === 'buy').sort((a, b) => this.order.range ? b.price - a.price : null);
          },
          ask: () => {
            return this.order.items.filter((item) => item.assigning === 'sell').sort((a, b) => this.order.range ? b.price - a.price : null);
          }
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
       * @returns {number|*}
       */
      priceCurrent() {
        if (this.order.items.length) {
          return this.order.items[0].price;
        }
        return 0;
      },

      /**
       * @returns {number|*}
       */
      pricePrevious() {
        if (this.order.items.length > 1) {
          return this.order.items[1].price;
        }
        return 0;
      },

      /**
       * @returns {string|string}
       */
      priceConcurrency() {
        if (this.order.items.length !== 1) {
          if (this.priceCurrent > this.pricePrevious) {
            return 'teal'
          }
          if (this.priceCurrent < this.pricePrevious) {
            return 'red'
          }
        }
        return this.$vuetify.theme.dark ? 'grey' : 'brown'
      }
    }
  }
</script>

<style scoped>

  .chip-marker {
    list-style: none;
    padding: 0;
    text-align: center;
  }

</style>