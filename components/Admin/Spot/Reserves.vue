<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="search" v-on:keyup="getReserves" color="primary" :label="$vuetify.lang.t('$vuetify.lang_209')" outlined dense hide-details />
        </v-col>
        <v-col cols="12" md="6">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large class="float-end">
            {{ count }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- End: header bar -->

    <v-divider />

    <template v-if="reserves.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="reserves" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
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
        <template v-slot:item.value="{ item }">
          {{ $decimal.format(item.value ? item.value : 0) }} <b>{{ (item.symbol).toUpperCase() }}</b>
        </template>
        <template v-slot:item.reverse="{ item }">
          <template v-if="item.protocol === 'mainnet'">
            {{ $decimal.format(item.reverse ? item.reverse : 0) }} <b>{{ (item.symbol).toUpperCase() }}</b>
          </template>
          <template v-else>
            <span class="red--text">OFF</span>
          </template>
        </template>
        <template v-slot:item.protocol="{ item }">
          <v-chip :color="$protocol.get(item.protocol).color" class="ml-0 mr-2 black--text" label small>
            {{ item.protocol }}
          </v-chip>
        </template>
        <template v-slot:item.platform="{ item }">
          <v-chip :color="$platform.get(item.platform).color" class="ml-0 mr-2 black--text" label small>
            {{ item.platform }}
          </v-chip>
        </template>
        <template v-slot:item.start="{ item }">
          <template v-if="item.lock">
            <v-btn @click="setReserveUnlock(item.id)" class="text-capitalize" color="red" elevation="0" outlined>
              {{ $vuetify.lang.t('$vuetify.lang_339') }}
            </v-btn>
          </template>
          <template v-else>
            <v-icon color="green">
              mdi-lock-open-check-outline
            </v-icon>
          </template>
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
          <h2>{{ $vuetify.lang.t('$vuetify.lang_340') }}</h2>
          <template v-if="search">
            {{ $vuetify.lang.t('$vuetify.lang_342') }}
          </template>
          <template v-else>
            {{ $vuetify.lang.t('$vuetify.lang_341') }}
          </template>
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
  name: "v-component-reserves",
  data() {
    return {
      search: "",
      reserves: [],
      overlay: true,
      limit: 15,
      count: 0,
      length: 0,
      page: 1
    }
  },
  watch: {
    $route() {
      this.getReserves();
    }
  },
  mounted() {
    this.getReserves();
  },
  methods: {

    /**
     *
     */
    getReserves() {
      this.overlay = true;

      if (this.search) {
        this.page = 1
      }

      this.$axios.$post(this.$api.admin.spot.getReserves, {
        search: this.search,
        limit: this.limit,
        page: this.page
      }).then((response) => {
        this.reserves = response.fields ?? [];
        this.count = response.count ?? 0;
        this.length = Math.ceil(this.count / this.limit);
        this.overlay = false;
      });
    },

    /**
     * @param id
     */
    setReserveUnlock(id) {
      this.$axios.$post(this.$api.admin.spot.setReserveUnlock, {
        id: id
      }).then(() => {
        let index = this.reserves.map((o) => o.id).indexOf(id);
        if (index !== -1) {
          this.reserves[index].lock = false;
        }
      }).catch((error) => {
        this.$snackbar.open({
          content: `${error.response.data.code}: ${error.response.data.message}`,
          color: 'red darken-2'
        });
      });
    },

    /**
     *
     */
    getMore() {
      this.getReserves();
    }
  },
  computed: {

    /**
     * @returns {[{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},null]}
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
          value: 'value'
        }, {
          text: this.$vuetify.lang.t('$vuetify.lang_292'),
          align: 'start',
          sortable: false,
          value: 'reverse'
        }, {
          text: this.$vuetify.lang.t('$vuetify.lang_336'),
          align: 'start',
          sortable: false,
          value: 'address'
        }, {
          text: this.$vuetify.lang.t('$vuetify.lang_270'),
          align: 'start',
          sortable: false,
          value: 'protocol'
        }, {
          text: this.$vuetify.lang.t('$vuetify.lang_113'),
          align: 'start',
          sortable: false,
          value: 'platform'
        }, {
          text: this.$vuetify.lang.t('$vuetify.lang_338'),
          align: 'center',
          sortable: false,
          value: 'start'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>