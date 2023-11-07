<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="4">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large :to="'/admin/spot/chains/create/editor'">
            <v-icon color="green">mdi-plus-thick</v-icon> {{ $vuetify.lang.t('$vuetify.lang_218') }}
          </v-btn>
        </v-col>
        <v-col cols="12" md="4"></v-col>
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
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="items" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer show-expand single-expand>
        <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
          <template v-if="isExpanded">
            <v-icon @click="expand(!isExpanded)">
              mdi-chevron-up
            </v-icon>
          </template>
          <template v-else>
            <v-icon @click="expand(!isExpanded)">
              mdi-chevron-down
            </v-icon>
          </template>
        </template>
        <template v-slot:item.name="{ item }">
          <div>
            {{ item.name }}
          </div>
          <div>
            <small class="grey--text">ID: {{ item.id }}</small>
          </div>
        </template>
        <template v-slot:item.rpc="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{(item.rpc).slice(0, 20) }}{{ item.rpc.length > 20 ? "..." : "" }}</span>
            </template>
            <span>{{ item.rpc }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.platform="{ item }">
          <v-chip :color="$platform.get(item.platform).color" class="ml-0 mr-2 black--text" label small>
            <template v-if="item.platform">
              {{ item.platform }}
            </template>
            <template v-else>
              BITCOIN
            </template>
          </v-chip>
        </template>
        <template v-slot:item.fees="{ item }">
          {{ item.fees ? item.fees : '∽' /*Supplier dependent*/ }} <b>{{ $platform.getSymbol(item.platform) }}</b>
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
          <v-btn :to="`/admin/spot/chains/${item.id}/editor`" icon>
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">

            <template v-if="$platform.get(item.platform).group === 'crypto'">

              <v-row align="center">
                <v-col cols="12" md="4">
                  <v-card class="my-4" outlined elevation="0">
                    <v-card-title>
                      {{ $vuetify.lang.t('$vuetify.lang_220') }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      {{ item.block ? item.block : 0 }}
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card class="my-4" outlined elevation="0">
                    <v-card-title>
                      {{ $vuetify.lang.t('$vuetify.lang_224') }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <template v-if="item.explorer_link">
                        {{ item.explorer_link }}/{hash}
                      </template>
                      <template v-else>
                        <v-icon>
                          mdi-incognito
                        </v-icon>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card class="my-4" outlined elevation="0">
                    <v-card-title>
                      {{ $vuetify.lang.t('$vuetify.lang_223') }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <template v-if="item.network">
                        <span class="teal--text">{{ item.network ? item.network : 0 }}</span>
                      </template>
                      <template v-else>
                        <span class="red--text">
                          <v-icon>
                            mdi-download-network-outline
                          </v-icon>
                        </span>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

            </template>
            <template v-else>
              <v-alert class="mt-4" icon="mdi-shield-lock-outline" prominent text type="info">
                {{ $vuetify.lang.t('$vuetify.lang_229') }}
              </v-alert>
            </template>

          </td>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 text-center">{{ $vuetify.lang.t('$vuetify.lang_215') }}</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">{{ $vuetify.lang.t('$vuetify.lang_217') }}</v-btn>
            <v-btn color="blue darken-1" text @click="deleteChain(chain_id)">{{ $vuetify.lang.t('$vuetify.lang_216') }}</v-btn>
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
          <h2>{{ $vuetify.lang.t('$vuetify.lang_264') }}</h2>
          {{ $vuetify.lang.t('$vuetify.lang_265') }}
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
    name: "v-component-chains",
    data() {
      return {
        chain_id: "",
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
        this.getChains();
      },
      dialog (val) {
        val || this.close()
      }
    },
    mounted() {
      this.getChains();
    },
    methods: {

      /**
       *
       */
      getChains() {
        this.overlay = true;

        this.$axios.$post(this.$api.admin.spot.getChains, {
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
      deleteChain(id) {
        this.$axios.$post(this.$api.admin.spot.deleteChain, {
          id: id
        }).then(() => {
          this.items.splice(this.items.map((o) => o.id).indexOf(id), 1);
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
        this.getChains();
      },

      /**
       *
       */
      close() {
        this.chain_id = "";
        this.dialog = false;
      },

      /**
       *
       */
      open(chain_id) {
        this.chain_id = chain_id;
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
            text: this.$vuetify.lang.t('$vuetify.lang_188'),
            align: 'start',
            sortable: false,
            value: 'name'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_219'),
            align: 'start',
            sortable: false,
            value: 'rpc'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_113'),
            align: 'start',
            sortable: true,
            value: 'platform'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_221'),
            align: 'start',
            sortable: true,
            value: 'fees'
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