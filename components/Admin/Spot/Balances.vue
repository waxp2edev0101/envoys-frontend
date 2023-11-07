<template>
  <div>

    <template v-if="items.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="items" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
        <template v-slot:item.symbol="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-avatar size="30">
                <v-img :src="$storages(['icon'], item.symbol)" v-bind="attrs" v-on="on" />
              </v-avatar>
            </template>
            <span>{{ (item.symbol).toUpperCase() }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.balance="{ item }">
          {{ $decimal.format(item.value ? item.value : 0) }} <b>{{ (item.symbol).toUpperCase() }}</b>
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

    <!-- Start: no history -->
    <template v-else-if="!overlay">
      <v-layout fill-height wrap>
        <v-flex/>
        <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
          <v-img class="ma-auto" width="250" src="/asset/3.png" />
          <h2>{{ $vuetify.lang.t('$vuetify.lang_343') }}</h2>
          {{ $vuetify.lang.t('$vuetify.lang_344') }}
        </v-flex>
        <v-flex/>
      </v-layout>
    </template>
    <!-- End: no history -->

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>
export default {
  name: "v-component-assets",
  data() {
    return {
      items: [],
      overlay: true,
      limit: 15,
      count: 0,
      length: 0,
      page: 1
    }
  },
  watch: {
    $route() {
      this.getBalances();
    }
  },
  mounted() {
    this.getBalances();
  },
  methods: {

    /**
     *
     */
    getBalances() {
      this.overlay = true;

      this.$axios.$post(this.$api.admin.spot.getBalances, {
        id: this.$route.params.id,
        search: this.search,
        limit: this.limit,
        page: this.page
      }).then((response) => {
        this.items = response.fields ?? [];
        this.count = response.count ?? 0;
        this.length = Math.ceil(this.count / this.limit);
        this.overlay = false;
      });
    },

    /**
     *
     */
    getMore() {
      this.getBalances();
    }
  },
  computed: {

    /**
     * @returns {[{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string}]}
     */
    headlines() {
      return [
        {
          text: this.$vuetify.lang.t('$vuetify.lang_187'),
          align: 'start',
          sortable: false,
          value: 'symbol'
        }, {
          text: this.$vuetify.lang.t('$vuetify.lang_337'),
          align: 'start',
          sortable: false,
          value: 'balance'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>