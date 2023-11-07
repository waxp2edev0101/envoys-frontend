<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="4">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large :to="'/admin/spot/pairs/create/editor'">
            <v-icon color="green">mdi-plus-thick</v-icon> {{ $vuetify.lang.t('$vuetify.lang_255') }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="search" v-on:keyup="getPairs" color="primary" :label="$vuetify.lang.t('$vuetify.lang_209')" outlined dense hide-details />
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
        <template v-slot:item.base_unit="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-avatar size="30">
                <v-img :src="$storages(['icon'], item.base_unit)" v-bind="attrs" v-on="on" />
              </v-avatar>
            </template>
            <span>{{ (item.base_unit).toUpperCase() }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.quote_unit="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-avatar size="30">
                <v-img :src="$storages(['icon'], item.quote_unit)" v-bind="attrs" v-on="on" />
              </v-avatar>
            </template>
            <span>{{ (item.quote_unit).toUpperCase() }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.price="{ item }">
          {{ item.price }} <b>{{ (item.quote_unit).toUpperCase() }}</b>
        </template>
        <template v-slot:item.decimal="{ item }">
          <v-chip color="blue lighten-4" class="ml-0 mr-2 black--text" label small>{{ item.base_decimal }}/{{ item.quote_decimal }}</v-chip>
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
        <template v-slot:item.edit="{ item }">
          <v-btn :to="`/admin/spot/pairs/${item.id}/editor`" icon>
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
            <v-btn color="blue darken-1" text @click="deletePair(pair_id)">{{ $vuetify.lang.t('$vuetify.lang_216') }}</v-btn>
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
            <h2>{{ $vuetify.lang.t('$vuetify.lang_262') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_263') }}
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
    name: "v-component-pairs",
    data() {
      return {
        search: "",
        pair_id: 0,
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
        this.getPairs();
      },
      dialog (val) {
        val || this.close()
      }
    },
    mounted() {
      this.getPairs();
    },
    methods: {

      /**
       *
       */
      getPairs() {
        this.overlay = true;

        if (this.search) {
          this.page = 1
        }

        this.$axios.$post(this.$api.admin.spot.getPairs, {
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
       * @param pair_id
       */
      deletePair(pair_id) {
        this.$axios.$post(this.$api.admin.spot.deletePair, {
          id: pair_id
        }).then(() => {
          this.items.splice(this.items.map((o) => o.id).indexOf(pair_id), 1);
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
        this.getPairs();
      },

      /**
       *
       */
      close() {
        this.pair_id = 0;
        this.dialog = false;
      },

      /**
       * @param pair_id
       */
      open(pair_id) {
        this.pair_id = pair_id;
        this.dialog = true;
      }
    },
    computed: {

      /**
       * @returns {[{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},null]}
       */
      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_253'),
            align: 'start',
            sortable: true,
            value: 'base_unit'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_254'),
            align: 'start',
            sortable: true,
            value: 'quote_unit'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_52'),
            align: 'start',
            sortable: true,
            value: 'price'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_260'),
            align: 'start',
            sortable: false,
            value: 'decimal'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_81'),
            align: 'start',
            sortable: true,
            value: 'status'
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