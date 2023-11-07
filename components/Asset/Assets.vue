<template>
  <div>

    <!-- Start: search asset element -->
    <v-card-actions>
      <v-text-field v-model="search" :label="$vuetify.lang.t('$vuetify.lang_84')" color="primary" dense hide-details outlined prepend-inner-icon="mdi-layers-search-outline" />
    </v-card-actions>
    <!-- Start: search asset element -->

    <v-divider />

    <!-- Start: list assets element -->
    <template v-if="assets.length">
      <template v-if="items.length">
        <v-card-text>
          <v-list class="pa-0 rounded-menu" rounded>
            <template v-for="item in items">
              <v-hover v-slot="{ hover }">
                <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" :key="item.id" :to="'/assets/' + item.symbol + '/deposit'" exact link>
                  <v-list-item-avatar size="40">
                    <v-img :src="$storages(['icon'], item.symbol)"/>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title><span :class="($vuetify.theme.dark ? 'white' : 'black') + '--text'">{{ item.symbol.toUpperCase() }}</span></v-list-item-title>
                    <v-list-item-subtitle>{{ item.name }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action :class="($vuetify.theme.dark ? '' : 'brown--text') + ' d-block text-right'">
                    <template v-if="hover">
                      ≈ ${{ item.price ? $decimal.format($decimal.mul(item.balance, item.price), 8) : $decimal.format(item.balance, 8) }}
                    </template>
                    <template v-else>
                      {{ $decimal.format(item.balance, 8) }}
                    </template>
                  </v-list-item-action>
                </v-list-item>
              </v-hover>
            </template>
          </v-list>
        </v-card-text>
      </template>
      <template v-else>
        <v-layout :style="'height: '+ (height) +'px'" wrap>
          <v-flex/>
          <v-flex align-self-center class="text-center mx-5">
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
      <v-layout wrap>
        <v-flex/>
        <v-flex align-self-center class="text-center mx-5">
          <div>
            <v-icon size="50">
              mdi-database-remove-outline
            </v-icon>
          </div>
          <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_78') }}</h4>
        </v-flex>
        <v-flex/>
      </v-layout>
    </template>
    <!-- End: list assets element -->

    <v-overlay :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" :value="overlay" absolute opacity="0.8">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>

  export default {
    name: "v-component-assets",
    data() {
      return {
        overlay: true,
        search: null,
        assets: [],
        height: 0
      }
    },
    mounted() {
      this.getAssets();

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
            data.user_id === Number(this.$auth.$state.user.fields[0].id)

        ) {
          this.assets.map(item => {
            if(item.symbol === data.symbol) {
              item.balance += data.value;
            }
          });

          // Sort assets by index.
          this.sort();
        }
      });

      /**
       * @event 'withdraw/cancel'
       * @object {symbol: string},
       * @object {value: float64}
       */
      this.$nuxt.$on('withdraw/cancel', (data) => {
        this.assets.map(item => {
          if(item.symbol === data[0].symbol) {
            item.balance += data[0].value;
          }
        });
      });

      /**
       * @event 'withdraw/create'
       * @object {symbol: string},
       * @object {value: float64}
       */
      this.$nuxt.$on('withdraw/create', (data) => {
        this.assets.map(item => {
          if(item.symbol === data.symbol) {
            item.balance -= data.value;
          }
        });
      });
    },
    methods: {

      /**
       * @param h
       */
      getHeight(h) {
        this.height = h - 57;
      },

      /**
       * Получаем список всех активов.
       */
      getAssets() {
        this.overlay = true;
        this.$axios.$post(this.$api.provider.getAssets).then((response) => {

          this.assets = response.fields ?? [];
          this.assets.map(item => {
            this.$axios.$get(this.$api.provider.getPrice + '?base_unit=' + item.symbol + '&quote_unit=usd').then((response) => {
              item.price = response.price;
            });
          });
          this.overlay = false;

          // Sort assets by index.
          this.sort();
        });
      },

      /**
       *
       */
      sort() {
        this.assets.sort((a, b) => {
          if (!a.balance) {
            a.balance = 0
          }
          if (!b.balance) {
            b.balance = 0
          }
          return b.balance - a.balance;
        });
      },

      /**
       * @param symbol
       * @returns {boolean}
       */
      active(symbol) {
        if (this.$route.params.symbol === null) {
          return false
        }

        return this.$route.params.symbol === symbol;
      }
    },
    computed: {

      /**
       * @returns {[]|*[]}
       */
      items() {
        if(this.search) {
          return this.assets.filter((item) => {
            return item.symbol.toUpperCase().includes(this.search.toUpperCase()) || item.name.toUpperCase().includes(this.search.toUpperCase())
          });
        } else {
          return this.assets;
        }
      }
    }
  }
</script>

<style scoped>

</style>
