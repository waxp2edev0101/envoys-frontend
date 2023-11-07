<template>
  <div>

    <!-- Start: app bar element -->
    <v-app-bar color="transparent" height="50" flat>
      <v-tabs v-model="pattern">
        <v-tab>
          {{ $vuetify.lang.t('$vuetify.lang_91') }}
        </v-tab>
        <v-tab>
          {{ $vuetify.lang.t('$vuetify.lang_159') }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <!-- End: app bar element -->

    <v-divider />

    <!-- Start: header bar -->
    <div class="pa-2">
      <v-row>
        <v-col cols="12" md="6">
          <v-btn color="black--text grey lighten-5 text-capitalize" elevation="0" large to="/admin/default/advertising/create/editor">
            <v-icon color="green">mdi-plus-thick</v-icon> {{ $vuetify.lang.t('$vuetify.lang_320') }}
          </v-btn>
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
      <v-data-table :class="count > limit ? 'none-radius ' : ''" :headers="headlines" :items="items" :page.sync="page" item-key="id" :server-items-length="length" :items-per-page="limit" hide-default-footer>
        <template v-slot:item.image="{ item }">
          <template v-if="item.pattern === 'sticker'">
            <v-img class="my-3" width="100" :src="$storages(['ads'], item.id)"></v-img>
          </template>
          <template v-else>
            <v-chip class="ml-0 mr-2 black--text" label small>
              AD TEXT
            </v-chip>
          </template>
        </template>
        <template v-slot:item.title="{ item }">
          <template v-if="item.title">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.title.substring(0,25) }}{{ item.title.length > 25 ? '...' : '' }}</span>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            {{ $vuetify.lang.t('$vuetify.lang_327') }}
          </template>
        </template>
        <template v-slot:item.text="{ item }">
          <template v-if="item.text">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">{{ item.text.substring(0,25) }}{{ item.text.length > 25 ? '...' : '' }}</span>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            {{ $vuetify.lang.t('$vuetify.lang_328') }}
          </template>
        </template>
        <template v-slot:item.link="{ item }">
          <template v-if="item.link">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <a :href="item.link" target="_blank" v-bind="attrs" v-on="on">{{ item.link.substring(0,25) }}{{ item.link.length > 25 ? '...' : '' }}</a>
              </template>
              <span>{{ item.link }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            {{ $vuetify.lang.t('$vuetify.lang_329') }}
          </template>
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn :to="`/admin/default/advertising/${item.id}/editor`" icon>
            <v-icon>
              mdi-circle-edit-outline
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn icon>
            <v-icon @click="deleteAdvertising(item.id)">
              mdi-close-circle-outline
            </v-icon>
          </v-btn>
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
          <h2>{{ $vuetify.lang.t('$vuetify.lang_330') }}</h2>
          {{ $vuetify.lang.t('$vuetify.lang_331') }}
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
    name: "v-component-advertising",
    data() {
      return {
        items: [],
        overlay: true,
        count: 0,
        limit: 5,
        length: 0,
        page: 1,
        pattern: 0
      }
    },
    watch: {
      pattern(e) {
        this.getAdvertisements(e ? 'sticker' : 'text');
      }
    },
    mounted() {
      this.getAdvertisements("text");
    },
    methods: {

      /**
       *
       */
      getMore() {
        this.getAdvertisements(this.pattern ? 'sticker' : 'text');
      },

      /**
       *
       */
      getAdvertisements(pattern) {
        this.overlay = true;
        this.$axios.$post(this.$api.ads.getAdvertisements, {
          pattern: pattern,
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
      deleteAdvertising(id) {
        this.$axios.$post(this.$api.admin.ads.deleteAdvertising, {
          id: id
        }).then(() => {

          this.count -= 1;
          this.length = Math.ceil(this.count / this.limit);
          this.items.splice(this.items.map((o) => o.id).indexOf(id), 1);
          if (!this.items.length && this.count > 0) {
            this.getMore();
          }

        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      },
    },
    computed: {

      /**
       * @returns {[{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string},{text: string, sortable: boolean, align: string, value: string}]}
       */
      headlines() {
        return [
          {
            text: this.$vuetify.lang.t('$vuetify.lang_325'),
            align: 'start',
            sortable: false,
            value: 'image'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_322'),
            align: 'start',
            sortable: false,
            value: 'title'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_323'),
            align: 'start',
            sortable: false,
            value: 'text'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_326'),
            align: 'end',
            sortable: false,
            value: 'link'
          }, {
            text: this.$vuetify.lang.t('$vuetify.lang_194'),
            align: 'end',
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