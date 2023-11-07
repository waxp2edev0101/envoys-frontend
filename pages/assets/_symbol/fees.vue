<template>
  <div class="mx-4 mt-3">

    <!-- Start: fees info -->
    <v-row class="mb-2" align="center">
      <v-col cols="12" md="6">
        <v-card height="250" outlined rounded="lg">
          <v-card-title>
            {{ $vuetify.lang.t('$vuetify.lang_148') }}
          </v-card-title>
          <v-card-subtitle>
            {{ asset.fees_trade }}%
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            {{ $vuetify.lang.t('$vuetify.lang_150') }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card height="250" outlined rounded="lg">
          <v-card-title>
            {{ $vuetify.lang.t('$vuetify.lang_149') }}
          </v-card-title>
          <v-card-subtitle>
            {{ asset.fees_discount ? $decimal.truncate($decimal.sub(asset.fees_trade, asset.fees_discount)) : 0 }}%
          </v-card-subtitle>
          <v-divider />
          <v-card-text>
            {{ $vuetify.lang.t('$vuetify.lang_147') }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- End: fees info -->

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        asset: {
          fees_trade: 0,
          fees_discount: 0
        },
        overlay: true
      }
    },
    mounted() {
      this.getAsset();
    },
    methods: {

      /**
       *
       */
      getAsset() {
        this.overlay = true;

        this.$axios.$post(this.$api.provider.getAsset, {symbol: this.$route.params.symbol, type: 'spot'}).then((response) => {
          this.asset = response.fields.lastItem ?? {};
          this.overlay = false;
        }).catch(e => {
          console.log(e)
        });
      }
    }
  }
</script>

<style scoped>

</style>