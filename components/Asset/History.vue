<template>
  <div>
    <template v-if="items.length">

      <!-- Start: data table -->
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines.top" :items="items" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer show-expand single-expand>
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
        <template v-slot:item.type="{ item }">
          <template v-if="item.assignment === 'withdrawal'">
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'red lighten-5 red--text') + ' ml-0 mr-2'" label small>
              <v-icon :color="item.status === 'pending' ? 'light-blue' : 'green'" size="15">
                mdi-arrow-top-left
              </v-icon>
              {{ $vuetify.lang.t('$vuetify.lang_92') }}
            </v-chip>
          </template>
          <template v-else>
            <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-5 blue--text') + ' ml-0 mr-2'" label small>
              <v-icon :color="item.status === 'pending' ? 'light-blue' : 'green'" size="15">
                mdi-arrow-bottom-left
              </v-icon>
              {{ $vuetify.lang.t('$vuetify.lang_120') }}
            </v-chip>
          </template>
        </template>
        <template v-slot:item.protocol="{ item }">
          <v-chip :color="$protocol.get(item.protocol).color" class="ml-0 mr-2 black--text" label small>
            {{ item.protocol }}
          </v-chip>
        </template>
        <template v-slot:item.value="{ item }">
          {{ item.assignment === 'deposit' ? '+' : '-' }}{{ $decimal.format(item.value, 8) }} <b>{{ item.symbol.toUpperCase() }}</b>
        </template>
        <template v-slot:item.status="{ item }">
          <template v-if="item.status === 'pending'">
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
          <template v-if="item.status === 'processing' || item.status === 'lock'">
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
          <div>
            {{ $moment(item.create_at).format('DD MMM') }}
          </div>
          <div>
            <small class="grey--text">{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
          </div>
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
                <v-list-item>
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ item.assignment === 'deposit' ? $vuetify.lang.t('$vuetify.lang_287') : $vuetify.lang.t('$vuetify.lang_105') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.assignment === 'deposit' ? '+' : '-' }}{{ item.value }} {{ item.symbol.toUpperCase() }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.assignment === 'withdrawal' && item.status === 'filled'">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_20') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.fees ? item.fees : 'Free' }} {{ item.symbol.toUpperCase() }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.assignment === 'withdrawal' && item.status === 'filled'">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_107') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.fees ? $decimal.sub(item.value, item.fees) : item.value }} {{ item.symbol.toUpperCase() }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item>
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_104') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.to }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item>
                  <v-item-group>
                    <v-list-item-title>
                      <v-btn-toggle class="text-uppercase" dense>
                        <v-btn color="blue white--text">
                          {{ $vuetify.lang.t('$vuetify.lang_113') }}: {{ item.platform }}({{ item.symbol.toUpperCase() }})
                        </v-btn>
                        <v-btn color="amber white--text">
                          {{ $vuetify.lang.t('$vuetify.lang_125') }}: {{ item.protocol }}
                        </v-btn>
                      </v-btn-toggle>
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item>
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_118') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ $moment(item.create_at).format('DD/M/YYYY hh:mm:ss') }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.chain.confirmation && item.assignment === 'deposit'">
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_153') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.chain.confirmation }}/{{ item.confirmation ? item.confirmation : 0 }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item>
                  <v-item-group>
                    <v-list-item-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_119') }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      {{ item.id }}
                    </v-list-item-title>
                  </v-item-group>
                </v-list-item>
                <v-list-item v-if="item.status === 'pending' && item.assignment === 'withdrawal' || item.status === 'failed'">
                  <v-btn color="white--text red text-capitalize" @click="cancelWithdraw(item.id)" large block elevation="0">{{ item.status === 'failed' ? $vuetify.lang.t('$vuetify.lang_124') + ` - Error: (${item.error})` : $vuetify.lang.t('$vuetify.lang_124') }}</v-btn>
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
            <v-pagination v-model="page" total-visible="5" @input="getMore()" :length="length"></v-pagination>
          </v-col>
        </v-row>
      </v-container>
      <!-- End: pagination -->

    </template>

    <!-- Start: no history -->
    <template v-else-if="!overlay">
      <div class="mx-4 max-width">
        <v-layout fill-height wrap>
          <v-flex/>
          <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
            <v-img class="ma-auto" width="250" src="/asset/2.png" />
            <h2>{{ $vuetify.lang.t('$vuetify.lang_123') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_122') }}
          </v-flex>
          <v-flex/>
        </v-layout>
      </div>
    </template>
    <!-- End: no history -->

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>
  export default {
    name: "v-component-history",
    data() {
      return {
        items: [],
        overlay: true,
        limit: 10,
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

      /**
       * Отслеживаем события вывода средств.
       * @event 'withdraw/status'
       * @return {callback}:
       */
      this.$publish.bind('withdraw/status', (data) => {
        this.items.map((item) => {
          if(Number(item.id) === data.id) {
            item.status = data.status;
            item.hash = data.hash;
            item.fees = data.fees;
            item.error = data.error ?? null
          }
        });
      });

      /**
       * Отслеживаем события нового депозита.
       * @event 'deposit/open'
       * @return {callback}:
       */
      this.$publish.bind('deposit/open', (data) => {
        if (!data) {
          return false
        }

        if (

            // Сверяем локальный штат пользователя
            // это у нас пользовательский [id] с полученным из события пользовательским [user_id],
            // если аргументы совпадают то это значит что ордер сработал частично или полностью.
            data.user_id === Number(this.$auth.$state.user.fields[0].id) &&

            // Получать обновление только по заданому символу.
            data.symbol === this.$route.params.symbol

        ) {

          if (data.hook) {

            this.items.map(item => {
              if(Number(item.id) === data.id) {
                item.status = "filled";
                item.confirmation = data.confirmation;
              }
            });

          } else {
            data.status = "pending";

            // Unshift append transaction to list.
            this.items.unshift(data);
            this.count += 1;
            this.length = Math.ceil(this.count/this.limit);

          }

        }
      });

      this.getTransactions();
    },
    methods: {

      /**
       *
       */
      getTransactions() {
        this.overlay = true;

        this.$axios.$post(this.$api.spot.getTransactions, {
          symbol: this.$route.params.symbol,
          assignment: this.type,
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
      },

      /**
       * @param id
       */
      cancelWithdraw(id) {
        this.$axios.$post(this.$api.spot.cancelWithdraw, {
          // Идентификатор вывода для удаления.
          id: id
        }).then((response) => {

          console.log(response);
          if (response.success) {
            this.$nuxt.$emit('withdraw/cancel', this.items.filter(item => item.id === id).map(item => item));

            this.items.map(item => {
              if(item.id === id) {
                item.status = 'cancel';
              }
            });
          } else {
            this.$snackbar.open({content: `Withdrawals in processed`, color: 'red darken-2'});
          }

        }).catch((error) => {
          this.$snackbar.open({content: `${error.response.data.code}: ${error.response.data.message}`, color: 'red darken-2'});
        });
      }

    },
    computed: {

      /**
       * @returns {string}
       */
      type() {
        return this.$route.params.type
      },

      /**
       * @returns {{top: [{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string}]}}
       */
      headlines() {
        return {
          top: [
            {
              text: this.$vuetify.lang.t('$vuetify.lang_82'),
              align: 'start',
              sortable: false,
              value: 'type'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_270'),
              align: 'start',
              sortable: false,
              value: 'protocol'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_53'),
              align: 'start',
              sortable: true,
              value: 'value'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_81'),
              align: 'start',
              sortable: true,
              value: 'status'
            }, {
              text: this.$vuetify.lang.t('$vuetify.lang_118'),
              align: 'start',
              sortable: true,
              value: 'create_at'
            }
          ]
        }
      }
    },

    /**
     *
     */
    beforeDestroy() {
      this.$publish.unbind(['deposit/open', 'withdraw/status']);
    }
  }
</script>

<style scoped>

</style>