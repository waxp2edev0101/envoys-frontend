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
        <template v-slot:item.value="{ item }">
          <template v-if="item.protocol === 'mainnet'">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ $decimal.format(item.value ? item.value : 0) }} <b>{{ (item.symbol).toUpperCase() }}</b>
              </span>
              </template>
              <span>
              {{ $vuetify.lang.t('$vuetify.lang_355') }}
            </span>
            </v-tooltip>
          </template>
          <template v-else>
            {{ $decimal.format(item.value ? item.value : 0) }} <b>{{ (item.symbol).toUpperCase() }}</b>
          </template>
        </template>
        <template v-slot:item.fees="{ item }">
          {{ $decimal.format(item.fees ? item.fees : 0) }} <b>{{ item.protocol === 'mainnet' ? (item.symbol).toUpperCase() : (item.parent_symbol).toUpperCase() }}</b>
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
        <template v-slot:item.repayment="{ item }">
          <template v-if="item.repayment">
            <v-icon color="green">
              mdi-check-all
            </v-icon>
          </template>
          <template v-else>
            <v-btn @click="setRepayment(item.id);" class="text-capitalize" color="red" elevation="0" outlined>
              {{ $vuetify.lang.t('$vuetify.lang_354') }} ({{ item.protocol === 'mainnet' ? $decimal.add(item.value, item.fees ?? 0) : item.fees }} <b>{{ item.protocol === 'mainnet' ? (item.symbol).toUpperCase() : (item.parent_symbol).toUpperCase() }}</b>)
            </v-btn>
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
          <h2>{{ $vuetify.lang.t('$vuetify.lang_356') }}</h2>
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
    name: "v-component-repayments",
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
    mounted() {
      this.getRepayments();
    },
    methods: {

      /**
       *
       */
      getRepayments() {
        this.overlay = true;

        this.$axios.$post(this.$api.admin.spot.getRepayments, {
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.items = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count/this.limit);
          this.overlay = false;
        });
      },

      /**
       * @param id
       */
      setRepayment(id) {
        this.$axios.$post(this.$api.admin.spot.setRepayment, {id: id}).then((response) => {
          if (response.success) {
            this.getRepayments();
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
        this.getRepayments();
      }
    },
    computed: {

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
            text: this.$vuetify.lang.t('$vuetify.lang_20'),
            align: 'start',
            sortable: false,
            value: 'fees'
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
            text: this.$vuetify.lang.t('$vuetify.lang_353'),
            align: 'right',
            sortable: false,
            value: 'repayment'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_118'),
            align: 'center',
            sortable: false,
            value: 'create_at'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>