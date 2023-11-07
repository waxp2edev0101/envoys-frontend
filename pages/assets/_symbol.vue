<template>
  <div>

    <!-- Start: tabs bar -->
    <v-tabs class="rounded-lg" v-model="eyelet" color="primary" show-arrows>
      <v-tab :to="'/assets/' + symbol + '/deposit'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_120') }}</v-tab>
      <v-tab :to="'/assets/' + symbol + '/withdrawal'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_92') }}</v-tab>
      <v-tab :to="'/assets/' + symbol + '/history'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_93') }}</v-tab>
      <v-tab :to="'/assets/' + symbol + '/fees'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_151') }}</v-tab>
    </v-tabs>
    <!-- End: tabs bar -->

    <v-divider />

    <!-- Start: header bar -->
    <v-component-header :asset="asset" :symbol="symbol" />
    <!-- End: header bar -->

    <!-- Start: child container -->
    <nuxt-child />
    <!-- End: child container -->

  </div>
</template>

<script>
  import Header from "../../components/Asset/Header";

  export default {
    components: {
      'v-component-header': Header,
    },
    data() {
      return {
        symbol: undefined,
        asset: undefined,
        eyelet: 0
      }
    },

    /**
     * @param $axios
     * @param $api
     * @param params
     * @param error
     * @returns {Promise<{symbol: string}|{symbol: *, asset: *}>}
     */
    async asyncData({ $axios, $api, params, error }) {
      let symbol = params.symbol;
      if (symbol) {
        return $axios.$post($api.provider.getAsset, {symbol: symbol, type: 'spot'}).then((response) => {
          let asset = response.fields.lastItem
          asset.volume = asset.volume ?? 0;
          asset.balance = asset.balance ?? 0;
          return { symbol, asset }
        }).catch(e => {
          error(e)
        });
      }
      return { symbol };
    }
  }
</script>

<style scoped>

</style>