<template>
  <div>
    <v-card-text>
      <v-row v-if="items.length" align="center">
        <v-col cols="12" md="3">
          <v-card height="80" outlined rounded="lg">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  {{ items[0].symbol.toUpperCase() }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ items[0].name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card height="80" outlined rounded="lg">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  {{ $vuetify.lang.t('$vuetify.lang_56') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $decimal.format(items[0].balance, 8) }} {{ items[0].symbol.toUpperCase() }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card height="80" outlined rounded="lg">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  {{ $vuetify.lang.t('$vuetify.lang_94') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{  $decimal.format(items[0].volume, 8) }} {{ items[0].symbol.toUpperCase() }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card height="80" outlined rounded="lg">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  {{ $vuetify.lang.t('$vuetify.lang_81') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <template v-if="items[0].status">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-checkbox-marked-circle-outline
                        </v-icon>
                      </template>
                      <span>{{ $vuetify.lang.t('$vuetify.lang_95') }}</span>
                    </v-tooltip>
                  </template>
                  <template v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-alert-circle-outline
                        </v-icon>
                      </template>
                      <span>{{ $vuetify.lang.t('$vuetify.lang_96') }}</span>
                    </v-tooltip>
                  </template>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title>
            Прописать количество ценных бумаг
          </v-card-title>
          <v-divider class="mb-5" />
          <v-card-text>
            <v-text-field color="primary" label="Количество активов" outlined hide-details />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>

    <v-divider />

    <template v-if="items[0]?.exist">

      <template v-if="items[0]?.agent_status === 'access'">

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="mb-4" elevation="0" outlined>
                <v-card-title class="text-uppercase">
                  Вывод активов
                </v-card-title>
                <v-divider />
                <v-card-subtitle>
                  <template v-if="items[0]?.type === 'broker'">
                    Введите количество активов, которые вы хотите вывести. Ваш вывод не требует подтверждения в разделе "Запросы на вывод". Статус будет автоматически изменен с "PENDING" на "FILLED".
                  </template>
                  <template v-else>
                    Введите количество активов, которые вы хотите вывести. После того, как ваша заявка будет рассмотрена брокером, актив будет выведен.
                  </template>
                </v-card-subtitle>
                <v-card-text>
                  <v-text-field v-model="quantity" color="primary" label="Количество активов" outlined hide-details />
                </v-card-text>
                <template v-if="quantity > 0">
                  <v-divider />
                  <v-card-actions>
                    <v-btn @click="setWithdraw" color="black--text yellow darken-1 text-capitalize" large block elevation="0">Вывести</v-btn>
                  </v-card-actions>
                </template>
              </v-card>

              <v-card v-if="items[0].type === 'broker' && !items[0].tag" class="mb-4" elevation="0" outlined>
                <v-card-title class="text-uppercase">
                  Ввести в оборот дополнительные активы
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-text-field v-model="value.add" color="primary" label="Количество активов" outlined hide-details />
                </v-card-text>
                <template v-if="value.add > 0">
                  <v-divider />
                  <v-card-actions>
                    <v-btn @click="setBrokerAsset(false)" color="black--text yellow darken-1 text-capitalize" large block elevation="0">Подтверждаю</v-btn>
                  </v-card-actions>
                </template>
              </v-card>

              <v-card v-if="items[0].type === 'broker' && !items[0].tag" class="mb-4" elevation="0" outlined>
                <v-card-title class="text-uppercase">
                  Вывести с оборота активы
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-text-field v-model="value.sub" color="primary" label="Количество активов" outlined hide-details />
                </v-card-text>
                <template v-if="value.sub > 0">
                  <v-divider />
                  <v-card-actions>
                    <v-btn @click="setBrokerAsset(true)" color="black--text yellow darken-1 text-capitalize" large block elevation="0">Подтверждаю</v-btn>
                  </v-card-actions>
                </template>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="mb-4" elevation="0" outlined>
                <v-card-title class="text-uppercase">
                  История вывода активов
                </v-card-title>
                <v-divider />
                <v-data-table :class="field.count > field.limit ? 'none-radius ' : ''" :items="field.items" :headers="headlines" :page.sync="field.page" item-key="id" :server-items-length="field.length" :items-per-page="field.limit" hide-default-footer>
                  <template v-slot:item.status="{ item }">
                    <template v-if="item.status === 'PENDING'">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                        {{ $vuetify.lang.t('$vuetify.lang_131') }}
                      </v-chip>
                    </template>
                    <template v-else-if="item.status === 'FILLED'">
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                        {{ $vuetify.lang.t('$vuetify.lang_129') }}
                      </v-chip>
                    </template>
                    <template v-else>
                      <v-chip :class="($vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-3 brown--text') + ' ml-0 mr-2'" label small>
                        {{ $vuetify.lang.t('$vuetify.lang_130') }}
                      </v-chip>
                    </template>
                  </template>
                  <template v-slot:item.value="{ item }">
                    {{ $decimal.format(item.value, 8) }} <b>{{ item.symbol.toUpperCase() }}</b>
                  </template>
                  <template v-slot:item.create_at="{ item }">
                    <div>
                      {{ $moment(item.create_at).format('DD MMM') }}
                    </div>
                    <div>
                      <small class="grey--text">{{ $moment(item.create_at).format('hh:mm:ss') }}</small>
                    </div>
                  </template>
                  <template v-slot:item.canceled="{ item }">
                    <template v-if="item.status === 'PENDING'">
                      <v-icon @click="cancelWithdraw(item.id)">
                        mdi-close-circle-outline
                      </v-icon>
                    </template>
                    <template v-else-if="item.status === 'FILLED'">
                      <v-icon>
                        mdi-check-circle-outline
                      </v-icon>
                    </template>
                    <template v-else>
                      <v-icon>
                        mdi-account-cancel-outline
                      </v-icon>
                    </template>
                  </template>
                </v-data-table>

                <v-divider v-if="field.count > field.limit" />

                <!-- Start: pagination -->
                <v-container v-if="field.length > 1" class="max-width">
                  <v-row justify="center">
                    <v-col cols="8">
                      <v-pagination v-model="field.page" total-visible="5" @input="getMore()" :length="field.length"></v-pagination>
                    </v-col>
                  </v-row>
                </v-container>
                <!-- End: pagination -->

              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

      </template>
      <template v-else-if="items[0]?.agent_status === 'blocked'">
        <v-card-text>
          <v-layout fill-height wrap>
            <v-flex/>
            <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
              <v-img class="ma-auto" width="250" src="/asset/6.png" />
              <div class="mt-4">Ваш торговый счет был заблокирован вашим брокером. Пожалуйста, свяжитесь со своим брокером, чтобы получить информацию о причинах блокировки вашего торгового счета.</div>
            </v-flex>
            <v-flex/>
          </v-layout>
        </v-card-text>
      </template>
      <template v-else>
        <v-layout fill-height wrap>
          <v-flex/>
          <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
            <v-img class="ma-auto" width="250" src="/asset/6.png" />
            <div class="mt-4">Вам пока что недоступно вводить или выводить акции, а бо национальную валюту.</div>
          </v-flex>
          <v-flex/>
        </v-layout>
      </template>

    </template>
    <template v-else>
      <v-card-text style="height:50vh;">
        <v-layout fill-height wrap>
          <v-flex/>
          <v-flex align-self-center class="text-center" md4 mx5 sm6 xl3>
            <v-btn @click="setAsset" color="black--text yellow darken-1 text-capitalize" large block elevation="0">Активировать счет {{ items[0]?.symbol.toUpperCase() }}</v-btn>
          </v-flex>
          <v-flex/>
        </v-layout>
      </v-card-text>
    </template>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        overlay: true,
        dialog: false,
        quantity: 0,
        items: [],
        field: {
          items: [],
          limit: 10,
          count: 0,
          length: 0,
          page: 1
        },
        value: {
          add: 0,
          sub: 0
        }
      }
    },
    watch: {
      $route() {
        this.getAsset();
      }
    },
    mounted() {
      if(this.$route.params.symbol) {
        this.getAsset();
      }
    },
    methods: {

      /**
       *
       */
      getMore() {
        this.getWithdraws();
      },

      /**
       * @param unshift
       */
      setBrokerAsset(unshift) {
        this.$axios.$post(this.$api.stock.setBrokerAsset, {
          symbol: this.$route.params.symbol,
          unshift: unshift,
          quantity: unshift ? this.value.sub : this.value.add
        }).then((response) => {
          if (response.success) {
            if (!this.items[0].balance) {
              this.items[0].balance = 0;
            }

            if (unshift) {
              this.$nuxt.$emit('stock/sub/asset', {
                symbol: this.$route.params.symbol,
                value: this.value.sub
              });
              this.items[0].balance -= Number(this.value.sub);
              this.value.sub = 0;
            } else {
              this.$nuxt.$emit('stock/add/asset', {
                symbol: this.$route.params.symbol,
                value: this.value.add
              });
              this.items[0].balance += Number(this.value.add);
              this.value.add = 0;
            }
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
      getWithdraws() {
        this.$axios.$post(this.$api.stock.getWithdraws, {
          symbol: this.$route.params.symbol,
          limit: this.field.limit,
          page: this.field.page
        }).then((response) => {
          this.field.items = response.fields ?? [];
          this.field.count = response.count ?? 0;
          this.field.length = Math.ceil(this.field.count/this.field.limit);
        });
      },

      /**
       *
       */
      setWithdraw() {
        this.$axios.$post(this.$api.stock.setWithdraw, {
          symbol: this.$route.params.symbol,
          quantity: this.quantity
        }).then((response) => {
          if (response.success) {
            this.$nuxt.$emit('stock/add/asset', {
              symbol: this.$route.params.symbol,
              value: this.quantity
            });
            this.items[0].balance = this.$decimal.sub(this.items[0].balance, this.quantity);
            this.quantity = 0;

            this.field.items.unshift(response.fields[0]);
            this.field.count += 1;
            this.field.length = Math.ceil(this.field.count/this.field.limit);
          }
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      },

      /**
       * @param id
       */
      cancelWithdraw(id) {
        this.$axios.$post(this.$api.stock.cancelWithdraw, {
          id: id
        }).then((response) => {
          if (response.success) {
            this.$nuxt.$emit('stock/sub/asset', {
              symbol: response.fields[0].symbol,
              value: response.fields[0].value
            });
            this.items[0].balance = this.$decimal.add(this.items[0].balance, response.fields[0].value);
            this.getWithdraws();
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
      setAsset() {
        this.$axios.$post(this.$api.stock.setAsset, {
          symbol: this.$route.params.symbol,
        }).then((response) => {
          let index = this.items.map((o) => o.symbol).indexOf(this.$route.params.symbol)
          let matching = this.items.some((o) => o.symbol === this.$route.params.symbol);
          if (matching) {
            this.items[index].exist = response.fields[0].exist;
          }
          this.$forceUpdate();
        });
      },

      /**
       *
       */
      getAsset() {
        this.overlay = true;
        this.$axios.$post(this.$api.stock.getAsset, {
          symbol: this.$route.params.symbol,
        }).then((response) => {
          this.items = response.fields ?? [];
          this.overlay = false;

          this.getWithdraws();
        });
      }
    },
    computed: {

      headlines() {
        return [
          {
            text: 'Status',
            align: 'start',
            sortable: false,
            value: 'status'
          }, {
            text: 'Quantity',
            align: 'start',
            sortable: false,
            value: 'value'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_118'),
            align: 'start',
            sortable: false,
            value: 'create_at'
          }, {
            text: 'Canceled',
            align: 'end',
            sortable: false,
            value: 'canceled'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>