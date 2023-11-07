<template>
  <!-- Start: header bar -->
  <div class="mx-4 mt-4">
    <v-row align="center">
      <v-col cols="12" md="3">
        <v-card height="118" outlined rounded="lg">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                {{ asset.symbol.toUpperCase() }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ asset.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar size="100">
              <v-img :src="$storages(['icon'], symbol)" width="100"/>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card height="118" outlined rounded="lg">
          <v-card-text class="mt-2 text-center">
            <div><small>{{ $vuetify.lang.t('$vuetify.lang_56') }}</small></div>
            <div class="text-h5">{{ $decimal.format(asset.balance, 8) }}</div>
            <small v-if="asset.balance">${{ $decimal.format(price ? (asset.balance ? $decimal.mul(price, asset.balance) : 0) : (asset.balance ? asset.balance : 0), 8) }}</small>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card height="118" outlined rounded="lg">
          <v-card-text class="mt-2 text-center">
            <div><small>{{ $vuetify.lang.t('$vuetify.lang_94') }}</small></div>
            <div class="text-h5">{{  $decimal.format(asset.volume, 8) }}</div>
            <small v-if="asset.volume">${{ $decimal.format(price ? (asset.volume ? $decimal.mul(price, asset.volume) : 0) : (asset.volume ? asset.volume : 0), 8) }}</small>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card height="118" outlined rounded="lg">
          <v-card-text class="mt-2 text-center">
            <div><small>{{ $vuetify.lang.t('$vuetify.lang_81') }}</small></div>
            <div class="text-h5">
              <template v-if="asset.status">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-checkbox-marked-circle-outline
                    </v-icon>
                  </template>
                  <span>{{ $vuetify.lang.t('$vuetify.lang_95') }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-alert-circle-outline
                    </v-icon>
                  </template>
                  <span>{{ $vuetify.lang.t('$vuetify.lang_96') }}</span>
                </v-tooltip>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <!-- End: header bar -->
</template>

<script>

  export default {
    name: "v-component-header",
    data() {
      return {
        price: 0
      }
    },
    props: {
      asset: {
        type: Object,
        default: undefined
      },
      symbol: {
        type: String,
        default: undefined
      }
    },
    watch: {
      $route(route) {
        this.getPrice(route.params.symbol);
      }
    },
    mounted() {

      setTimeout(() => {
        this.getPrice(this.symbol);
      }, 1000);

      /**
       * Отслеживаем события нового депозита.
       * @event 'deposit/open/status'
       * @return {callback}:
       */
      this.$nuxt.$on('deposit/open/status', (data) => {
        if (

            // Сверяем локальный штат пользователя
            // это у нас пользовательский [id] с полученным из события пользовательским [user_id],
            // если аргументы совпадают то это значит что ордер сработал частично или полностью.
            data.user_id === Number(this.$auth.$state.user.fields[0].id) &&

            // Получать обновление только по заданому символу.
            data.symbol === this.symbol

        ) {
          this.asset.balance += data.value
        }
      });

      /**
       * @event 'withdraw/cancel'
       * @object {symbol: string},
       * @object {value: float64}
       */
      this.$nuxt.$on('withdraw/cancel', (data) => {
        this.asset.balance += data[0].value
      });

      /**
       * @event 'withdraw/create'
       * @object {symbol: string},
       * @object {value: float64}
       */
      this.$nuxt.$on('withdraw/create', (data) => {
        this.asset.balance -= data.value
      });
    },
    methods: {

      /**
       * @param symbol
       */
      getPrice(symbol) {
        this.$axios.$get(this.$api.provider.getPrice + '?base_unit=' + symbol + '&quote_unit=usd').then((response) => {
          this.price = response.price ?? 0;
        });
      }
    }
  }
</script>

<style scoped>

</style>