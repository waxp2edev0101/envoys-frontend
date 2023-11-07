<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="4">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large :to="'/admin/spot/assets/create/editor'">
            <v-icon color="green">mdi-plus-thick</v-icon> {{ $vuetify.lang.t('$vuetify.lang_195') }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="search" v-on:keyup="getAssets" color="primary" :label="$vuetify.lang.t('$vuetify.lang_209')" outlined dense hide-details />
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
            <span>ID: {{ item.id }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.name="{ item }">
          <div>
            {{ item.name }}
          </div>
          <div>
            <b>{{ item.symbol.toUpperCase() }}</b>
          </div>
        </template>
        <template v-slot:item.group="{ item }">
          <template v-if="item.group === 'fiat'">
            Fiat
          </template>
          <template v-else>
            Crypto
          </template>
        </template>
        <template v-slot:item.fees_charges="{ item }">
          {{ $decimal.format(item.fees_charges, 8) }} <b>{{ item.symbol.toUpperCase() }}</b>
        </template>
        <template v-slot:item.marker="{ item }">
          <template v-if="item.marker">
            <v-icon color="green">
              mdi-crown-outline
            </v-icon>
          </template>
          <template v-else>
            <v-icon color="red">
              mdi-label-outline
            </v-icon>
          </template>
        </template>
        <template v-slot:item.status="{ item }">
          <template v-if="item.status">
            <v-icon color="green">
              mdi-check-circle-outline
            </v-icon>
          </template>
          <template v-else>
            <v-icon color="red">
              mdi-close-circle-outline
            </v-icon>
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
        <template v-slot:item.edit="{ item }">
          <v-btn :to="`/admin/spot/assets/${item.symbol}/editor`" icon>
            <v-icon>
              mdi-circle-edit-outline
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn @click="open(item.symbol)" icon>
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
            <v-btn color="blue darken-1" text @click="deleteAsset(symbol)">{{ $vuetify.lang.t('$vuetify.lang_216') }}</v-btn>
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
          <template v-if="search">
            <h2>{{ $vuetify.lang.t('$vuetify.lang_210') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_211') }}
          </template>
          <template v-else>
            <h2>{{ $vuetify.lang.t('$vuetify.lang_196') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_197') }}
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
    name: "v-component-assets",
    data() {
      return {
        symbol: "",
        search: "",
        items: [],
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
        this.getAssets();
      },
      dialog (val) {
        val || this.close()
      }
    },
    mounted() {
      this.getAssets();
    },
    methods: {

      /**
       *
       */
      getAssets() {
        this.overlay = true;

        if (this.search) {
          this.page = 1
        }

        this.$axios.$post(this.$api.admin.spot.getAssets, {
          search: this.search,
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
       * @param symbol
       */
      deleteAsset(symbol) {
        this.$axios.$post(this.$api.admin.spot.deleteAsset, {
          symbol: symbol
        }).then(() => {
          this.items.splice(this.items.map((o) => o.symbol).indexOf(symbol), 1);
          this.count -= 1;
          this.length = Math.ceil(this.count/this.limit);
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
        this.getAssets();
      },

      /**
       *
       */
      close() {
        this.symbol = "";
        this.dialog = false;
      },

      /**
       * @param symbol
       */
      open(symbol) {
        this.symbol = symbol;
        this.dialog = true;
      }
    },
    computed: {

      /**
       * @returns {[{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},null,null]}
       */
      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_187'),
            align: 'start',
            sortable: false,
            value: 'symbol'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_188'),
            align: 'start',
            sortable: false,
            value: 'name'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_208'),
            align: 'start',
            sortable: true,
            value: 'group'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_189'),
            align: 'start',
            sortable: true,
            value: 'fees_charges'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_190'),
            align: 'start',
            sortable: true,
            value: 'marker'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_191'),
            align: 'start',
            sortable: true,
            value: 'status'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_192'),
            align: 'start',
            sortable: true,
            value: 'create_at'
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