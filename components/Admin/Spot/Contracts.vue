<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="4">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large :to="'/admin/spot/contracts/create/editor'">
            <v-icon color="green">mdi-plus-thick</v-icon> {{ $vuetify.lang.t('$vuetify.lang_267') }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="search" v-on:keyup="getContracts" color="primary" :label="$vuetify.lang.t('$vuetify.lang_209')" outlined dense hide-details />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large class="float-end">
            {{ count }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- End: header bar -->

    <v-divider />

    <template v-if="contracts.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="contracts" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
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
        <template v-slot:item.chain_id="{ item }">
          <v-chip color="blue lighten-4" class="ml-0 mr-2 black--text" label small>{{ item.chain_id }}</v-chip> {{ item.chain_name }}
        </template>
        <template v-slot:item.address="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                {{ item.address.slice(0,20) }}...
              </span>
            </template>
            <span>{{ item.address }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.fees="{ item }">
          {{ item.fees }} <b>{{ (item.parent_symbol).toUpperCase() }}</b>
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
        <template v-slot:item.edit="{ item }">
          <v-btn :to="`/admin/spot/contracts/${item.id}/editor`" icon>
            <v-icon>
              mdi-circle-edit-outline
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn @click="open(item.id)" icon>
            <v-icon>
              mdi-close-circle-outline
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <!-- End: data table -->

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 text-center">{{ $vuetify.lang.t('$vuetify.lang_215') }}</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">{{ $vuetify.lang.t('$vuetify.lang_217') }}</v-btn>
            <v-btn color="blue darken-1" text @click="deleteContract(contract_id)">{{ $vuetify.lang.t('$vuetify.lang_216') }}</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
          <h2>{{ $vuetify.lang.t('$vuetify.lang_271') }}</h2>
          {{ $vuetify.lang.t('$vuetify.lang_272') }}
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
    name: "v-component-contracts",
    data() {
      return {
        search: "",
        contract_id: 0,
        chains: [],
        contracts: [],
        overlay: true,
        limit: 12,
        count: 0,
        length: 0,
        page: 1,
        dialog: false
      }
    },
    watch: {
      $route() {
        this.getContracts();
      },
      dialog (val) {
        val || this.close()
      }
    },
    mounted() {
      this.getContracts();
    },
    methods: {

      /**
       *
       */
      getContracts() {
        this.overlay = true;

        if (this.search) {
          this.page = 1
        }

        this.$axios.$post(this.$api.admin.spot.getContracts, {
          search: this.search,
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.contracts = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count / this.limit);
          this.overlay = false;
        });
      },

      /**
       * @param contract_id
       */
      deleteContract(contract_id) {
        this.$axios.$post(this.$api.admin.spot.deleteContract, {
          id: contract_id
        }).then(() => {
          this.contracts.splice(this.contracts.map((o) => o.id).indexOf(contract_id), 1);
          this.count -= 1;
          this.dialog = false;
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
        this.getContracts();
      },

      /**
       *
       */
      close() {
        this.contract_id = 0;
        this.dialog = false;
      },

      /**
       *
       */
      open(contract_id) {
        this.contract_id = contract_id;
        this.dialog = true;
      }
    },
    computed: {

      /**
       * @returns {[{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},null,null,null]}
       */
      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_187'),
            align: 'start',
            sortable: true,
            value: 'symbol'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_268'),
            align: 'start',
            sortable: true,
            value: 'chain_id'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_269'),
            align: 'start',
            sortable: false,
            value: 'address'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_221'),
            align: 'start',
            sortable: true,
            value: 'fees'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_270'),
            align: 'start',
            sortable: true,
            value: 'protocol'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_113'),
            align: 'start',
            sortable: true,
            value: 'platform'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_194'),
            align: 'start',
            sortable: false,
            value: 'edit'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_222'),
            align: 'end',
            sortable: false,
            value: 'delete'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>