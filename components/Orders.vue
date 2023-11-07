<template>
  <div>
    <template v-if="orders.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines.top" :items="orders" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer show-expand single-expand>
        <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
          <template v-if="isExpanded">
            <v-icon @click="getTrades(item.id, item.assigning, expand(!isExpanded))">
              mdi-chevron-up
            </v-icon>
          </template>
          <template v-else>
            <v-icon @click="getTrades(item.id, item.assigning, expand(!isExpanded))">
              mdi-chevron-down
            </v-icon>
          </template>
        </template>
        <template v-slot:item.assigning="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <template v-if="item.assigning === 'sell'">
                <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'red lighten-5 red--text') + ' ml-0 mr-2'" label small>
                  <v-icon color="red" size="15">
                    mdi-arrow-top-left
                  </v-icon>
                  {{ $vuetify.lang.t('$vuetify.lang_140') }}
                </v-chip>
              </template>
              <template v-else>
                <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5 blue--text') + ' ml-0 mr-2'" label small>
                  <v-icon color="blue" size="15">
                    mdi-arrow-bottom-left
                  </v-icon>
                  {{ $vuetify.lang.t('$vuetify.lang_141') }}
                </v-chip>
              </template>
            </template>
            <span>{{ $vuetify.lang.t('$vuetify.lang_139') }}: {{ item.id }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.symbol="{ item }">
          <b class="text-uppercase">{{ item.base_unit }}/{{ item.quote_unit }}</b>
        </template>
        <template v-slot:item.quantity="{ item }">
          {{ $decimal.truncate(item.quantity) }} {{ item.base_unit.toUpperCase() }}
        </template>
        <template v-slot:item.price="{ item }">
          {{ item.price }} {{ item.quote_unit.toUpperCase() }}
        </template>
        <template v-slot:item.total="{ item }">
          {{ $decimal.truncate($decimal.mul(item.quantity, item.price)) }} {{ item.quote_unit.toUpperCase() }}
        </template>
        <template v-slot:item.status="{ item }">
          <template v-if="item.status === 'pending'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_131') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'filled'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_129') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'cancel'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_130') }}
            </v-chip>
          </template>
        </template>
        <template v-slot:item.create_at="{ item }">
          <div>
            {{ $moment(item.create_at).format('DD MMM') }}
          </div>
          <div>
            <small class="grey--text">{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
          </div>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card class="my-4" outlined elevation="0">
              <v-data-table :headers="headlines.child" :items="trades" :hide-default-header="!trades.length" hide-default-footer>
                <template v-slot:item.maker="{ item }">
                  <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                    {{ item.maker ? "Maker" : "Taker" }}
                  </v-chip>
                </template>
                <template v-slot:item.quantity="{ item }">
                  <template v-if="item.assigning === 'sell'">
                    - {{ $decimal.truncate(item.quantity) }} {{ item.base_unit.toUpperCase() }}
                  </template>
                  <template v-else>
                    + {{ $decimal.truncate(item.quantity) }} {{ item.base_unit.toUpperCase() }}
                  </template>
                </template>
                <template v-slot:item.fees="{ item }">
                  {{ $decimal.format(item.fees, 8) }} {{ item.base_unit.toUpperCase() }} <small>{{ $decimal.truncate($decimal.mul(item.fees, item.price), 8) }} {{ item.quote_unit.toUpperCase() }}</small>
                </template>
                <template v-slot:item.price="{ item }">
                  {{ item.price }} {{ item.quote_unit.toUpperCase() }}
                </template>
                <template v-slot:item.total="{ item }">
                  {{ $decimal.format($decimal.sub($decimal.mul(item.quantity, item.price), $decimal.mul(item.fees, item.price)), 8) }} {{ item.quote_unit.toUpperCase() }} <small>{{ $decimal.format($decimal.mul(item.quantity, item.price), 8) }} {{ item.quote_unit.toUpperCase() }}</small>
                </template>
                <template v-slot:item.create_at="{ item }">
                  <div>
                    {{ $moment(item.create_at).format('DD MMM') }}
                  </div>
                  <div>
                    <small class="grey--text">{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </td>
        </template>
      </v-data-table>
      <!-- End: data table -->

      <v-divider v-if="count > limit" />

      <!-- Start: pagination -->
      <v-container v-if="length > 1" class="max-width">
        <v-row justify="center">
          <v-col cols="8">
            <v-pagination v-model="page" @input="getMore()" :length="length"></v-pagination>
          </v-col>
        </v-row>
      </v-container>
      <!-- End: pagination -->

    </template>
    <template v-else-if="!overlay">
      <div class="mx-4 max-width">
        <v-layout fill-height wrap>
          <v-flex/>
          <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
            <v-img class="ma-auto" width="250" src="/asset/3.png" />
            <h2>{{ $vuetify.lang.t('$vuetify.lang_123') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_135') }}
          </v-flex>
          <v-flex/>
        </v-layout>
      </div>
    </template>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>
  export default {
    name: "v-component-orders",
    data() {
      return {
        orders: [],
        trades: [],
        overlay: true,
        limit: 15,
        count: 0,
        length: 0,
        page: 1
      }
    },
    watch: {
      $route() {
        this.getOrders();
      }
    },
    mounted() {
      this.getOrders();
    },
    methods: {

      /**
       *
       */
      getOrders() {
        this.$axios.$post(this.$api.provider.getOrders, {
          owner: true,
          assigning: this.assigning,
          status: this.status,
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.orders = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count/this.limit);
          this.overlay = false;
        });
      },

      /**
       * TODO: проверить назначения assigning.
       * @param id
       * @param assigning
       * @param callback
       */
      getTrades(id, assigning, callback) {
        this.$axios.$post(this.$api.spot.getTrades, {
          order_id: id,
          owner: true,
          assigning: assigning,
          limit: 100,
        }).then((response) => {
          this.trades = response.fields ?? [];
          if (typeof callback === 'function') {
            callback();
          }
        });
      },

      /**
       *
       */
      getMore() {
        this.getOrders();
      },

      /**
       * @param item
       * @returns {*|number}
       */
      getFees(item) {
        if (item.assigning) {
          return this.$decimal.format(this.$decimal.mul(item.fees, item.price), 8);
        } else {
          return this.$decimal.format(item.fees, 8);
        }
      }
    },
    computed: {

      /**
       * @returns {any}
       */
      status() {
        return this.$route.params.status
      },

      /**
       * @returns {any}
       */
      assigning() {
        switch (this.$route.params.assigning) {
          case 'purchase':
            return 'buy'
          case 'sale':
            return 'sell'
          default:
            return null
        }
      },

      /**
       * @returns {{top: [{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},null,null], child: [{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string}]}}
       */
      headlines() {
        return {
          top: [
            {
              text: this.$vuetify.lang.t('$vuetify.lang_132'),
              align: 'start',
              sortable: true,
              value: 'assigning'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_133'),
              align: 'start',
              sortable: false,
              value: 'symbol'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_53'),
              align: 'start',
              sortable: true,
              value: 'quantity'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_52'),
              align: 'start',
              sortable: true,
              value: 'price'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_56'),
              align: 'start',
              sortable: false,
              value: 'total'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_81'),
              align: 'start',
              sortable: true,
              value: 'status'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_118'),
              align: 'start',
              sortable: true,
              value: 'create_at'
            }
          ],
          child: [
            {
              text: this.$vuetify.lang.t('$vuetify.lang_82'),
              align: 'center',
              sortable: false,
              value: 'maker'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_53'),
              align: 'start',
              sortable: true,
              value: 'quantity'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_20'),
              align: 'start',
              sortable: false,
              value: 'fees'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_52'),
              align: 'start',
              sortable: true,
              value: 'price'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_56'),
              align: 'start',
              sortable: false,
              value: 'total'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_118'),
              align: 'start',
              sortable: true,
              value: 'create_at'
            }
          ]
        }
      }
    }
  }
</script>

<style scoped>

</style>