<template>
  <div>

    <!-- Start: app bar element -->
    <v-app-bar color="transparent" height="50" flat>
      <v-tabs fixed-tabs v-model="eyelet">
        <v-tab>
          Ценные бумаги
        </v-tab>
        <v-tab>
          Нац. Валюта
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <!-- End: app bar element -->

    <v-divider />

    <v-card-text>
      <v-list class="pa-0 rounded-menu" rounded>
        <template v-for="item in items">
          <v-hover v-slot="{ hover }">
            <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" :key="item.id" :to="'/stock/' + item.symbol" exact link>
              <v-list-item-action>
                <template v-if="item.zone">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip v-bind="attrs" v-on="on" class="ml-0 mr-2 black--text text-uppercase d-block text-center chip-w" label>
                        {{ item.symbol }}
                      </v-chip>
                    </template>
                    <span>{{ item.name }} - {{ item.price }} <b>{{ (item.zone).toUpperCase() }}</b></span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip v-bind="attrs" v-on="on" class="ml-0 mr-2 black--text text-uppercase" label>
                        {{ item.symbol }}
                      </v-chip>
                    </template>
                    <span>{{ item.name }}</span>
                  </v-tooltip>
                </template>
              </v-list-item-action>
              <v-list-item-content />
              <v-list-item-action :class="($vuetify.theme.dark ? '' : 'brown--text') + ' d-block text-right'">
                {{ $decimal.format(item.balance, 8) }}
              </v-list-item-action>
            </v-list-item>
          </v-hover>
        </template>
      </v-list>
    </v-card-text>

    <v-divider />

    <v-card-actions v-if="items.length">
      <v-btn :to="`/trade/${items[0].symbol}-${items[0].zone}?type=stock`" color="text-capitalize" large block elevation="0">Перейти к торгам</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
  export default {
    name: "v-component-stock-assets",
    data() {
      return {
        items: [],
        eyelet: 0,
        type: false,
      }
    },
    watch: {
      eyelet(e) {
        this.type = e === 1;

        this.getAssets();
      }
    },
    mounted() {

      this.$nuxt.$on('stock/sub/asset', (data) => {
        this.getAssets();
      });

      this.$nuxt.$on('stock/add/asset', (data) => {
        this.getAssets();
      });

      this.getAssets();
    },
    methods: {

      getAssets() {
        this.$axios.$post(this.$api.stock.getAssets, {fiat: this.type}).then((response) => {
          this.items = response.fields ?? [];

          if (!this.$route.params.symbol) {
            this.$router.push('/stock/' + this.items[0].symbol);
          }
        });
      },
    }
  }
</script>

<style scoped>

  .chip-w {
    width: 80px !important;
  }

</style>