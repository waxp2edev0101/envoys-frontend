<template>
  <v-card class="ma-1 rounded-lg" height="500" elevation="0">

    <!-- Start: pair search element -->
    <template v-if="!overlay">
      <v-card-actions>
        <v-text-field color="primary" v-model="search" dense hide-details outlined :label="$vuetify.lang.t('$vuetify.lang_50')" prepend-inner-icon="mdi-layers-search-outline" />
      </v-card-actions>
      <v-divider />
    </template>
    <!-- End: pair search element -->

    <!-- Start: pairs list element -->
    <template v-if="items.length">
      <template v-if="parse.markets().length">
        <v-virtual-scroll @mouseover="hover = true" @mouseleave="hover = false" :class="hover ? '' : 'overflow-y-hidden'" bench="0" :items="parse.markets()" height="393" item-height="49">
          <template v-slot:default="{ item }">
            <v-list-item :color="$vuetify.theme.dark ? 'grey darken-3' : 'deep-purple lighten-5'" :to="'/trade/' + item.base_unit + '-' + item.quote_unit + '?type=stock'" :key="item.id" dense>
              <v-list-item-content>
                <v-list-item-title><span :class="($vuetify.theme.dark ? 'white' : 'black') + '--text'">{{ item.base_unit.toUpperCase() }}/</span><span class="grey--text">{{ item.quote_unit.toUpperCase() }}</span></v-list-item-title>
                <template v-if="item.status">
                  <v-list-item-subtitle>{{ $decimal.format(item.price ? item.price : 0) }} {{ item.quote_unit.toUpperCase() }}</v-list-item-subtitle>
                </template>
                <template v-else>
                  <v-list-item-subtitle class="red--text text-uppercase">{{ $vuetify.lang.t('$vuetify.lang_127') }}</v-list-item-subtitle>
                </template>
              </v-list-item-content>
              <v-list-item-action>
                <template v-if="item.status">
                  <span :class="Math.sign(item.ratio) === -1 ? 'red--text' : 'teal--text'">{{ item.ratio ? (Math.sign(item.ratio) === -1 ? (item.ratio).toFixed(2) : `+${(item.ratio).toFixed(2)}`) : '+0.00' }}%</span>
                </template>
                <template v-else>
                  <v-icon>
                    mdi-power-cycle
                  </v-icon>
                </template>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </template>
      <template v-else>
        <v-layout style="height: 393px" wrap>
          <v-flex/>
          <v-flex class="text-center mx-5" align-self-center>
            <div>
              <v-icon size="50">
                mdi-database-remove-outline
              </v-icon>
            </div>
            <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_49') }}</h4>
          </v-flex>
          <v-flex/>
        </v-layout>
      </template>
    </template>
    <template v-else-if="!overlay">
      <v-layout style="height: 393px" wrap>
        <v-flex/>
        <v-flex class="text-center mx-5" align-self-center>
          <div>
            <v-icon size="50">
              mdi-database-remove-outline
            </v-icon>
          </div>
          <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_48') }}</h4>
        </v-flex>
        <v-flex/>
      </v-layout>
    </template>
    <!-- End: pairs list element -->

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </v-card>
</template>

<script>
export default {
  name: "v-component-stock-market",
  data() {
    return {
      header: false,
      overlay: false,
      eyelet: 0,
      search: '',
      items: [],
      hover: false
    }
  },
  watch: {
    kind(e) {
      console.log(e);
    },
    eyelet(e) {
      console.log(e);
    }
  },
  mounted() {

    /**
     * Отслеживаем события бегущей строки, данные об торгах.
     * @object {base_unit: string},
     * @object {close: float},
     * @object {high: float},
     * @object {low: float},
     * @object {open: float},
     * @object {quote_unit: string},
     * @object {time: int}
     */
    this.$publish.bind('trade/ticker:0', (data) => {
      if (data.fields && data.fields.length > 1) {
        this.items.filter((item) => {
          if (

              // Сверяем принадлежат ли новые события к данному активу,
              // если аргументы совпадают то привязываем полученные данные из события к данному активу.
              item.base_unit === data.fields[0].base_unit &&
              item.quote_unit === data.fields[0].quote_unit

          ) {
            item.ratio = ((data.fields[0].close - data.fields[1].close) / data.fields[1].close) * 100;
            item.price = data.fields[0].close;
            return item;
          }

        });
      }
    });

    this.getPairs();
  },
  methods: {

    getPairs(symbol) {
      this.$axios.$post(this.$api.stock.getPairs, { symbol: (symbol ?? this.parse.base())}).then((response) => {
        this.items = response.fields ?? [];
      });
    }
  },
  computed: {

    /**
     * @returns {{base: (function(): string)}}
     */
    parse() {
      return {
        base: () => {
          return this.$route.params.unit.split('-')[0]
        },
        markets: () => {
          return this.items.filter((item) => item.symbol.toUpperCase().includes(this.search.toUpperCase()));
        },
      }
    }
  }
}
</script>

<style scoped>

</style>