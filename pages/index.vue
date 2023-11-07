<template>
  <section class="pa-0">

    <template v-if="loader">

      <!-- Start: parallax cover component -->
      <v-parallax src="./cover.webp" class="pa-0">
        <v-layout justify-center align-end>
          <v-flex xs8>
            <v-img position="center center" src="./wrapper/1.svg"/>
          </v-flex>
        </v-layout>
        <div class="text-center py-5" style="background-color: #1e1e1eba;z-index: 6;position: absolute;width: 100%;">
          <h2 class="mb-4">
            EXCHANGE
          </h2>
          <div class="subheading">
            {{ $vuetify.lang.t('$vuetify.lang_47') }}
          </div>
          <v-btn color="black--text yellow darken-1 text-capitalize" large elevation="0" class="mt-2" to="/signup">
            {{ $vuetify.lang.t('$vuetify.lang_6') }}
          </v-btn>
        </div>
      </v-parallax>
      <!-- End: parallax cover component -->

      <!-- Start: advertisements list component -->
      <div :class="($vuetify.theme.dark ? 'grey darken-4' : 'white')">
        <section v-if="advertisements.length" class="px-2 main-role">
          <v-slide-group class="flex-center" show-arrows>
            <v-slide-item class="slide" v-for="item in advertisements" :key="item.id">
              <a :href="item.link" target="_blank"><v-img width="259" class="item" :src="$storages(['ads'], item.id)"></v-img></a>
            </v-slide-item>
          </v-slide-group>
        </section>
      </div>
      <!-- End: advertisements list component -->

      <div :class="'py-3 ' + ($vuetify.theme.dark ? 'blue-grey-darken-3' : '')">
        <section :class="(this.$vuetify.breakpoint.mobile ? 'px-3' : 'px-15') + ' main-role'">

          <v-card class="rounded-lg" elevation="0">

            <template v-if="this.$vuetify.breakpoint.mobile">

              <v-data-table :headers="headlines" :items="markets" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
                <template v-slot:item.symbol="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar class="my-2" size="50">
                        <v-img :src="$storages(['icon'], item.base_unit)" v-bind="attrs" v-on="on" />
                      </v-avatar>
                    </template>
                    <span>{{ (item.base_unit).toUpperCase() }}</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar class="my-2 ml-n7" size="40">
                        <v-img :src="$storages(['icon'], item.quote_unit)" v-bind="attrs" v-on="on" />
                      </v-avatar>
                    </template>
                    <span>{{ (item.quote_unit).toUpperCase() }}</span>
                  </v-tooltip>
                </template>
                <template v-slot:item.price="{ item }">
                  <b :class="($vuetify.theme.dark ? 'white' : 'black') + '--text'">{{ item.price ? item.price : '--' }} {{ item.quote_unit.toUpperCase() }}</b>
                  <span :class="Math.sign(item.ratio) === -1 ? 'red--text' : 'green--text'">
                    {{ item.ratio ? (Math.sign(item.ratio) === -1 ? item.ratio.toFixed(2) : `+${item.ratio.toFixed(2)}`) : '+0.00' }}%
                    <v-icon color="red" v-if="Math.sign(item.ratio) === -1">
                      mdi-menu-down
                    </v-icon>
                    <v-icon color="green" v-else>
                      mdi-menu-up
                    </v-icon>
                  </span>
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
              </v-data-table>

            </template>
            <template v-else>

              <!-- Start: app bar element -->
              <v-app-bar v-if="!header" color="transparent" height="65" flat>
                <v-layout wrap>
                  <v-flex>
                    <v-text-field style="width: 300px;margin-top: 3px;" color="primary" v-model="search" v-on:keyup="getMarkets" dense hide-details outlined :label="$vuetify.lang.t('$vuetify.lang_50')" prepend-inner-icon="mdi-layers-search-outline" />
                  </v-flex>
                  <v-flex></v-flex>
                  <v-flex>
                    <v-btn style="width: 128px;margin-top: 2px;" :color="($vuetify.theme.dark ? 'white--text grey darken-3' : 'black--text grey lighten-5') + ' text-capitalize'" elevation="0" large class="float-end">
                      {{ $vuetify.lang.t('$vuetify.lang_160') }}: {{ count }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-app-bar>
              <!-- End: app bar element -->

              <v-divider />

              <template v-if="markets.length">
                <v-simple-table>
                  <template v-slot:default>
                    <thead v-if="header" style="height: 65px">
                    <tr>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_160') }}
                      </th>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_52') }}
                      </th>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_333') }}
                      </th>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_68') }}
                      </th>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_67') }}
                      </th>
                      <th class="text-center">
                        {{ $vuetify.lang.t('$vuetify.lang_69') }}
                      </th>
                      <th class="text-center">
                        {{ $vuetify.lang.t('$vuetify.lang_81') }}
                      </th>
                      <th class="text-left">
                        {{ $vuetify.lang.t('$vuetify.lang_332') }}
                      </th>
                      <th class="text-left"></th>
                    </tr>
                    </thead>
                    <tbody @mouseover="header = true" @mouseleave="header = false">
                    <tr v-for="item in markets" :key="item.id">
                      <td width="100">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar class="my-2" size="50">
                              <v-img :src="$storages(['icon'], item.base_unit)" v-bind="attrs" v-on="on" />
                            </v-avatar>
                          </template>
                          <span>{{ (item.base_unit).toUpperCase() }}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-avatar class="position my-3 ml-n7" size="40">
                              <v-img :src="$storages(['icon'], item.quote_unit)" v-bind="attrs" v-on="on" />
                            </v-avatar>
                          </template>
                          <span>{{ (item.quote_unit).toUpperCase() }}</span>
                        </v-tooltip>
                      </td>
                      <td width="300">
                        {{ item.price ? item.price : '--' }} <b :class="($vuetify.theme.dark ? 'white' : 'black') + '--text'">{{ item.quote_unit.toUpperCase() }}</b>
                      </td>
                      <td width="200">
                        <v-chip :color="$vuetify.theme.dark ? '' : (Math.sign(item.ratio) === -1 ? 'red lighten-5 red--text' : 'green lighten-5 green--text')" label>
                          <span class="text-subtitle-1">{{ item.ratio ? (Math.sign(item.ratio) === -1 ? item.ratio.toFixed(2) : `+${item.ratio.toFixed(2)}`) : '+0.00' }}%</span>
                          <v-icon color="red" v-if="Math.sign(item.ratio) === -1">
                            mdi-menu-down
                          </v-icon>
                          <v-icon color="green" v-else>
                            mdi-menu-up
                          </v-icon>
                        </v-chip>
                      </td>
                      <td width="150">
                        {{ item.low ?? '0.000000' }}
                      </td>
                      <td width="150">
                        {{ item.high ?? '0.000000' }}
                      </td>
                      <td class="text-center" width="150">
                        {{ item.volume ?? '0.000000' }}
                      </td>
                      <td class="text-center" width="200">
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
                      </td>
                      <td class="text-center" width="150">
                        <template v-if="item.ticker">
                          <v-sparkline :value="item.ticker" :smooth="16" :height="100" line-width="2" :gradient="$vuetify.theme.dark ? ['#8a8a8a', '#bbbbbb'] : ['#2a7e1d', '#82c977']" />
                        </template>
                        <template v-else>
                          <v-chip label>
                            {{ $vuetify.lang.t('$vuetify.lang_127') }}
                          </v-chip>
                        </template>
                      </td>
                      <td class="text-center" width="100">
                        <v-btn :disabled="!item.status" style="width: 117px;text-transform: none !important;" color="black--text yellow darken-1" large block elevation="0" :to="'/trade/' + item.base_unit + '-' + item.quote_unit + '?type=spot'" >{{ $vuetify.lang.t('$vuetify.lang_334') }}</v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </template>
              <template v-else-if="!overlay">
                <v-layout wrap>
                  <v-flex/>
                  <v-flex class="text-center mx-5 my-16" align-self-center>
                    <div>
                      <v-icon size="50">
                        mdi-database-remove-outline
                      </v-icon>
                    </div>
                    <h4 class="text-overline">{{ $vuetify.lang.t('$vuetify.lang_49') }}</h4>
                  </v-flex>
                  <v-flex/>
                </v-layout>
              </template>

            </template>

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

            <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
              <v-progress-circular color="yellow darken-3" indeterminate size="50" />
            </v-overlay>

          </v-card>

        </section>
      </div>

    </template>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="1" :value="!loader">
      <v-progress-circular color="yellow darken-3" indeterminate size="100" />
    </v-overlay>

  </section>
</template>

<script>

  export default {
    auth: 'guest',
    data() {
      return {
        header: false,
        loader: false,
        overlay: false,
        markets: [],
        limit: 10,
        count: 0,
        length: 0,
        page: 1,
        search: '',
        advertisements: []
      }
    },
    mounted() {

      /**
       * Отслеживаем события бегущей строки, данные об торгах.
       * @object {base_unit: string},
       * @object {close: float},
       * @object {high: float},
       * @object {low: float},
       * @object {open: float},
       * @object {quote_unit: string},
       * @object {time: int}
       */
      this.$publish.bind('trade/ticker:0', (data) => {
        if (data.fields && data.fields.length > 1) {
          this.markets.filter((item) => {
            if (

                // Сверяем принадлежат ли новые события к данному активу,
                // если аргументы совпадают то привязываем полученные данные из события к данному активу.
                item.base_unit === data.fields[0].base_unit &&
                item.quote_unit === data.fields[0].quote_unit

            ) {

              if (item.ticker) {
                item.ticker.splice(0, 1);
                item.ticker.push(data.fields[0].close);
              }

              if (data.stats?.volume) {
                item.volume = data.stats?.volume;
              }

              item.low = data.stats.low;
              item.high = data.stats.high;
              item.ratio = ((data.fields[0].close - data.fields[1].close) / data.fields[1].close) * 100;
              item.price = data.fields[0].close;
              return item;
            }

          });

        }
      });

      setTimeout(() => {
        if (this.$auth.loggedIn) {
          return this.$router.push('/assets');
        } else {
          this.loader = true;
        }
      }, 1000);
      this.getAdvertisements();
      this.getMarkets();
    },
    methods: {

      /**
       *
       */
      getMore() {
        this.getMarkets()
      },

      /**
       *
       */
      getMarkets() {
        this.overlay = true;
        this.$axios.$post(this.$api.index.getMarkets, {
          search: this.search,
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.markets = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count/this.limit);
          this.overlay = false;
        });
      },

      /**
       *
       */
      getAdvertisements() {
        this.$axios.$post(this.$api.ads.getAdvertisements, {
          class: 1,
          random: true
        }).then((response) => {
          this.advertisements = response.fields ?? [];
        });
      },
    },
    computed: {

      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_160'),
            align: 'start',
            sortable: false,
            value: 'symbol'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_52'),
            align: 'start',
            sortable: false,
            value: 'price'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_81'),
            align: 'start',
            sortable: false,
            value: 'status'
          }
        ]
      }
    }
  }

</script>

<style lang="scss">
  .position {
    position: absolute !important;
  }
  .slide {
    margin: 7.5px 0;

    .item {
      margin: 7.5px;
    }

    &:first-child {
      div {
        margin-left: 0 !important;
      }
    }

    &:last-child {
      div {
        margin-right: 0 !important;
      }
    }
  }
  .flex-center > .v-slide-group__wrapper > .v-slide-group__content {
      align-items: center;
      justify-content: center;
  }
</style>
