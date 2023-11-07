<template>
  <div class="pa-4">

    <!-- Start: dashboard info -->
    <v-row align="center">
      <v-col cols="12" md="3">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-account-circle-outline</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_251') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h2>{{ statistic.accounts ? (statistic.accounts.disable ? statistic.accounts.disable : 0) : 0 }}</h2>
                <small class="red--text">Disable</small>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <h2>{{ statistic.accounts ? (statistic.accounts.enable ? statistic.accounts.enable : 0) : 0 }}</h2>
                <small class="teal--text">Enable</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-upload-network-outline</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_250') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h2>{{ statistic.chains ? (statistic.chains.disable ? statistic.chains.disable : 0) : 0 }}</h2>
                <small class="red--text">Disable</small>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <h2>{{ statistic.chains ? (statistic.chains.enable ? statistic.chains.enable : 0) : 0 }}</h2>
                <small class="teal--text">Enable</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-priority-high</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_249') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h2>{{ statistic.currencies ? (statistic.currencies.disable ? statistic.currencies.disable : 0) : 0 }}</h2>
                <small class="red--text">Disable</small>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <h2>{{ statistic.currencies ? (statistic.currencies.enable ? statistic.currencies.enable : 0) : 0 }}</h2>
                <small class="teal--text">Enable</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-arrange-send-to-back</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_248') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h2>{{ statistic.pairs ? (statistic.pairs.disable ? statistic.pairs.disable : 0) : 0 }}</h2>
                <small class="red--text">Disable</small>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <h2>{{ statistic.pairs ? (statistic.pairs.enable ? statistic.pairs.enable : 0) : 0 }}</h2>
                <small class="teal--text">Enable</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-transfer</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_247') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h2>{{ statistic.transactions ? (statistic.transactions.filled ? statistic.transactions.filled : 0) : 0 }}</h2>
                <small class="red--text">Filled</small>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <h2>{{ statistic.transactions ? (statistic.transactions.pending ? statistic.transactions.pending : 0) : 0 }}</h2>
                <small class="teal--text">Pending</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-radar</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_246') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h2>{{ statistic.orders ? (statistic.orders.buy ? statistic.orders.buy : 0) : 0 }}</h2>
                <small class="teal--text">Buy</small>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <h2>{{ statistic.orders ? (statistic.orders.sell ? statistic.orders.sell : 0) : 0 }}</h2>
                <small class="red--text">Sell</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card height="150" outlined rounded="lg">
          <v-card-title class="font-size-18px">
            <v-icon>mdi-safe-square-outline</v-icon>&nbsp;{{ $vuetify.lang.t('$vuetify.lang_245') }}
          </v-card-title>
          <v-divider />
          <v-card-text class="text-center">
            <h3 class="my-3">{{ $decimal.truncate(value) }} USD</h3>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
    <!-- End: dashboard info -->

    <v-divider class="my-5" />

    <v-row align="center">
      <v-col v-for="(item, i) in statistic.reserves" :key="i" cols="12" md="4">
        <v-card outlined rounded="lg">
          <v-card-text class="text-center">
            <v-row align="center">
              <v-col cols="12" md="3">
                <v-avatar size="50">
                  <v-img :src="$storages(['icon'], item.symbol)" />
                </v-avatar>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <div><b>{{ (item.symbol).toUpperCase() }}</b></div>
                <v-divider class="my-2" />
                <div>
                  <small>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ item.value ? $decimal.truncate(item.value) : 0 }}</span>
                      </template>
                      <span>{{ $vuetify.lang.t('$vuetify.lang_290') }}</span>
                    </v-tooltip>
                    <v-divider class="my-2" />
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ item.value_charged ? $decimal.truncate(item.value_charged) : 0 }}</span>
                      </template>
                      <span>{{ $vuetify.lang.t('$vuetify.lang_245') }}</span>
                    </v-tooltip>
                  </small>
                </div>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="3">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <small v-bind="attrs" v-on="on">-{{ item.value_costs ? $decimal.truncate(item.value_costs) : 0 }}</small>
                  </template>
                  <span>{{ $vuetify.lang.t('$vuetify.lang_292') }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>

  export default {
    name: "v-component-spot-dashboard",
    data() {
      return {
        statistic: {},
        value: 0
      }
    },
    mounted() {
      this.getDashboard();
    },
    methods: {
      getDashboard() {
        this.$axios.$get(this.$api.index.getStatistic).then((response) => {
          this.statistic = response.fields;
          this.statistic.reserves.map((item) => {
            if (item.symbol === "usdt" || item.symbol === "usd") {
              item.value_charged_convert = item.value_charged;
            }
            if (item.value_charged_convert) {
              this.value += item.value_charged_convert;
            }
          })
        });
      }
    }
  }
</script>

<style scoped>

  .font-size-18px {
    font-size: 18px;
  }

</style>