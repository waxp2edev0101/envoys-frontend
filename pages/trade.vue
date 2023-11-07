<template>
  <section :class="(this.$store.state.localStorage.screen || $route.query.type === 'stock' ? '' : 'main-role') + ' pa-0'">

    <template v-if="loader">

      <v-row v-if="$route.query.type === 'spot'" class="ma-1" no-gutters>

        <v-col :order-xl="$store.state.localStorage.screen ? 2 : 0" cols="12" :xl="$store.state.localStorage.screen ? 2 : 3" lg="3" md="12" sm="12" class="hidden-md-and-down hidden-sm-and-down">
          <!-- Start: order book component -->
          <v-component-spot-book />
          <!-- End: order book component -->
        </v-col>

        <v-col :order-xl="$store.state.localStorage.screen ? 0 : 1" cols="12" :xl="$store.state.localStorage.screen ? 8 : 6" lg="6" md="12" sm="12">
          <!-- Start: pair trade chart component -->
          <nuxt-child />
          <!-- End: pair trade chart component -->

          <!-- Start: my trade history component -->
          <v-component-spot-history class="mt-2" />
          <!-- End:  my trade history component -->
        </v-col>

        <v-col :order-xl="$store.state.localStorage.screen ? 2 : 2" cols="12" :xl="$store.state.localStorage.screen ? 2 : 3" lg="3" md="12" sm="12">
          <!-- Start: trade form component -->
          <v-component-spot-form />
          <!-- End: trade form component -->

          <!-- Start: list of trading pairs market component -->
          <v-component-spot-market class="mt-2" />
          <!-- End: list of trading pairs market component -->
        </v-col>

      </v-row>

      <v-row v-if="$route.query.type === 'future'" class="ma-1" no-gutters>
        <!-- <p>future trading view</p> -->
        <v-col lg="9" md="12" sm="12">
            <v-row no-gutters>
              <v-col cols="12" lg="8">
                <nuxt-child />
              </v-col>
              <v-col lg="4" cols="12" style="height: 498px">
                <v-component-future-book />
              </v-col>
              <v-col>
                <v-component-future-portfolio />
              </v-col>
            </v-row>
        </v-col>
        <v-col lg="3" md="12" sm="12" style="padding-bottom: 7px">
          <v-component-future-form />
        </v-col>
      </v-row>

      <v-row v-if="$route.query.type === 'stock'" class="ma-1" no-gutters>

        <v-col cols="12" xl="8" lg="6" md="12" sm="12">
          <!-- Start: pair trade chart component -->
          <nuxt-child />
          <!-- End: pair trade chart component -->

          <v-component-stock-history class="mt-2" />

        </v-col>

        <v-col cols="12" xl="2" lg="3" md="12" sm="12" class="hidden-md-and-down hidden-sm-and-down">
          <v-component-stock-book />
        </v-col>

        <v-col cols="12" xl="2" lg="3" md="12" sm="12">
          <v-component-stock-form />
          <v-component-stock-market class="mt-2" />
        </v-col>

      </v-row>

    </template>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="1" :value="!loader">
      <v-progress-circular color="yellow darken-3" indeterminate size="100" />
    </v-overlay>
  </section>

</template>

<script>

  import SpotMarket from '~/components/Spot/Market';
  import SpotForm from '~/components/Spot/Form';
  import SpotBook from "~/components/Spot/Book";
  import SpotHistory from "~/components/Spot/History";

  import StockBook from "~/components/Stock/Book";
  import StockForm from '~/components/Stock/Form';
  import StockMarket from '~/components/Stock/Market';
  import StockHistory from "~/components/Stock/History";

  import FutureBook from '~/components/Future/Book'
  import FuturePortfolio from '~/components/Future/Portfolio'
  import FutureForm from '~/components/Future/Form'

  export default {
    auth: false,
    components: {
      'v-component-spot-market': SpotMarket,
      'v-component-spot-form': SpotForm,
      'v-component-spot-book': SpotBook,
      'v-component-spot-history': SpotHistory,
      'v-component-stock-book': StockBook,
      'v-component-stock-form': StockForm,
      'v-component-stock-market': StockMarket,
      'v-component-stock-history': StockHistory,
      'v-component-future-portfolio': FuturePortfolio,
      'v-component-future-form': FutureForm,
      'v-component-future-book': FutureBook,
    },
    data() {
      return {
        loader: false,
      }
    },

    watch: {
      $route() {
        this.getSymbol(false);
      }
    },

    /**
     *
     */
    mounted() {
      this.getSymbol(true);
    },

    methods: {
      getSymbol(loader) {
        if (this.$route.query.type !== 'spot' && this.$route.query.type !== 'stock' && this.$route.query.type !== 'future') {
          this.$nuxt.error({ statusCode: 404, message: 'Type trade not found!.' });
          return false
        }

        this.loader = !loader;

        //this.$axios.$post(this.$api[this.$route.query.type].getSymbol, {base_unit: this.parse.base(), quote_unit: this.parse.quote()}).then(() => {
          if (loader) {
            setTimeout(() => {
              this.loader = true;
            }, 1000);
          }
        //}).catch((error) => {
        //  this.$nuxt.error({ statusCode: 404, message: error.response.data.message });
        //});
      }
    },

    computed: {

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
      }
    },

    /**
     *
     */
    beforeDestroy() {
      this.$publish.unbind(['trade/ticker:0', 'order/status', 'order/create', 'order/cancel']);

      // Internal event off.
      this.$nuxt.$off('deposit/open/status');
    }
  }
</script>

<style scoped>

</style>