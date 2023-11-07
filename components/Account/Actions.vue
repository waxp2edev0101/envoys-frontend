<template>
  <div style="height: 100%">
    <template v-if="actions.length">

      <!-- Start: data table -->
      <v-data-table class="rounded-lg" :headers="headlines.top" :items="actions" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
        <template v-slot:item.os="{ item }">
          <v-icon>mdi-application-cog-outline</v-icon> <span class="text-capitalize">{{ item.os }}</span>
        </template>
        <template v-slot:item.device="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                <template v-if="item.device === 'desktop'">
                  mdi-desktop-classic
                </template>
                <template v-else-if="item.device === 'mobile' || item.device === 'iPhone' || item.device === 'SM-G955U'">
                  mdi-cellphone
                </template>
                <template v-else-if="item.device === 'tablet' || item.device === 'iPad'">
                  mdi-tablet-android
                </template>
                <template v-else>
                  mdi-alert-circle-outline
                </template>
              </v-icon>
            </template>
            <span class="text-capitalize">{{ item.device }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.ip="{ item }">
          {{ item.ip }}
        </template>
        <template v-slot:item.browser="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                <template v-if="item.browser[0] === 'chrome'">
                  mdi-google-chrome
                </template>
                <template v-else-if="item.browser[0] === 'firefox'">
                  mdi-firefox
                </template>
                <template v-else-if="item.browser[0] === 'safari'">
                  mdi-apple-safari
                </template>
                <template v-else-if="item.browser[0] === 'opera'">
                  mdi-opera
                </template>
                <template v-else>
                  mdi-alert-circle-outline
                </template>
              </v-icon>
            </template>
            <span class="text-capitalize">{{ item.browser[0] }}</span>
          </v-tooltip>
          V.{{ item.browser[1] }}
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
      <div class="mx-4 max-width">
        <v-layout fill-height wrap>
          <v-flex/>
          <v-flex align-self-center class="text-center my-16" md4 mx5 sm6 xl3>
            <v-img class="ma-auto" width="250" src="/asset/3.png" />
            <h2>{{ $vuetify.lang.t('$vuetify.lang_123') }}</h2>
            {{ $vuetify.lang.t('$vuetify.lang_162') }}
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
    name: "v-component-actions",
    data() {
      return {
        actions: [],
        overlay: true,
        limit: 16,
        count: 0,
        length: 0,
        page: 1
      }
    },
    watch: {
      $route() {
        this.getActions();
      }
    },
    mounted() {
      this.getActions()
    },
    methods: {

      /**
       *
       */
      getActions() {
        this.overlay = true;

        this.$axios.$post(this.$api.account.getActions, {
          limit: this.limit,
          page: this.page
        }).then((response) => {
          this.actions = response.fields ?? [];
          this.count = response.count ?? 0;
          this.length = Math.ceil(this.count/this.limit);
          this.overlay = false;
        });
      },

      /**
       *
       */
      getMore() {
        this.getActions();
      }
    },
    computed: {

      /**
       * @returns {{top: [{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string}]}}
       */
      headlines() {
        return {
          top: [
            {
              text: 'Os',
              align: 'start',
              sortable: false,
              value: 'os'
            }, {
              text: 'Device',
              align: 'start',
              sortable: false,
              value: 'device'
            }, {
              text: 'Ip',
              align: 'start',
              sortable: true,
              value: 'ip'
            }, {
              text: 'Browser',
              align: 'start',
              sortable: true,
              value: 'browser'
            }, {
              text: 'Date',
              align: 'start',
              sortable: true,
              value: 'create_at'
            }
          ]
        }
      }
    }
  }
</script>

<style scoped>

</style>