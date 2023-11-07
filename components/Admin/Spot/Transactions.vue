<template>
  <div>

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="search" v-on:keyup="getTransactions" color="primary" :label="$vuetify.lang.t('$vuetify.lang_209')" outlined dense hide-details />
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
        <template v-slot:item.to="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ item.to.slice(0,20) }}...
                </span>
            </template>
            <span>{{ item.to }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.value="{ item }">
          {{ item.assignment === 'deposit' ? '+' : '-' }}{{ item.value }} {{ item.symbol.toUpperCase() }}
        </template>
        <template v-slot:item.status="{ item }">
          <template v-if="item.status === 'pending' || item.status === 'lock'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_131') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'filled'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_129') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'failed'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_295') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'reserve'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'amber lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_290') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'processing'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_291') }}
            </v-chip>
          </template>
          <template v-if="item.status === 'cancel'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
              {{ $vuetify.lang.t('$vuetify.lang_130') }}
            </v-chip>
          </template>
        </template>
        <template v-slot:item.create_at="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon>mdi-clock-time-nine-outline</v-icon> {{ $moment(item.create_at).format('YY-MM-DD') }}
              </div>
            </template>
            <span>
              {{ $moment(item.create_at).format('YY-MM-DD h:mm:ss') }}
            </span>
          </v-tooltip>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-card class="my-4" outlined elevation="0">
              <v-list two-line>
                <v-list-item>
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_285') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.chain.name }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.hash">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_284') }}
                    </v-list-item-subtitle>
                    <v-list-item-title v-if="item.chain.explorer_link">
                      <template v-if="item.hash.split('-').length === 5">
                        <i>INTERNAL:{{ item.hash }}</i>
                      </template>
                      <template v-else>
                        <a :href="`${item.chain.explorer_link}/${item.hash}`" target="_blank">
                          <i>{{ item.hash }}</i>
                        </a>
                      </template>
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.assignment === 'withdrawal'">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_20') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.fees ? item.fees : 'Free' }} {{ item.symbol.toUpperCase() }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.assignment === 'withdrawal'">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_107') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.fees ? item.value - item.fees : item.value }} {{ item.symbol.toUpperCase() }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.chain.confirmation && item.assignment === 'deposit'">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_153') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.chain.confirmation }}/{{ item.confirmation ? item.confirmation : 0  }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.error">
                  <v-item-group>
                    <v-list-item-subtitle class="red--text">
                      {{ $vuetify.lang.t('$vuetify.lang_295') }}
                    </v-list-item-subtitle>
                    <v-list-item-title class="red--text">
                      {{  item.error }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
              </v-list>
            </v-card>
          </td>
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
          <template v-if="search">
            <h2>{{ $vuetify.lang.t('$vuetify.lang_210') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_211') }}
          </template>
          <template v-else>
            <h2>{{ $vuetify.lang.t('$vuetify.lang_123') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_122') }}
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
    name: "v-component-transactions",
    data() {
      return {
        search: "",
        items: [],
        overlay: true,
        limit: 12,
        count: 0,
        length: 0,
        page: 1
      }
    },
    watch: {
      $route() {
        this.getTransactions();
      }
    },
    mounted() {
      this.getTransactions();
    },
    methods: {

      /**
       *
       */
      getTransactions() {
        this.overlay = true;

        this.$axios.$post(this.$api.admin.spot.getTransactions, {
          id: this.$route.params.id,
          assignment: this.$route.params.type,
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
       *
       */
      getMore() {
        this.getTransactions();
      }

    },
    computed: {

      /**
       * @returns {[{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},{text: *, sortable: boolean, align: string, value: string},null,null]}
       */
      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_187'),
            align: 'start',
            sortable: false,
            value: 'symbol'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_113'),
            align: 'start',
            sortable: false,
            value: 'platform'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_270'),
            align: 'start',
            sortable: true,
            value: 'protocol'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_104'),
            align: 'start',
            sortable: true,
            value: 'to'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_53'),
            align: 'start',
            sortable: true,
            value: 'value'
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
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>