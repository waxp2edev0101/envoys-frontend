<template>
  <div class="ma-4">

    <template v-if="asset.chains && (!empty || empty === 1)">
      <template v-if="asset.group === 'crypto'">

        <!-- Start: tabs bar -->
        <v-tabs v-model="eyelet" color="primary">
          <v-tab v-for="item in asset.chains" :key="item.id" class="text-capitalize">{{ item.contract ? item.contract.protocol : 'mainnet' }}</v-tab>
        </v-tabs>
        <!-- End: tabs bar -->

        <!-- Start: tabs items -->
        <v-tabs-items v-model="eyelet" class="mt-3">
          <v-tab-item v-for="(item, index) in asset.chains" :key="item.id" :transition="false" class="mt-1">
            <template v-if="item.exist">
              <v-row>
                <v-col cols="12" md="6">
                  <template v-if="!item.status">
                    <v-card class="mb-4" elevation="0" outlined>
                      <v-card-subtitle class="text-uppercase">
                        <b class="red--text">{{ $vuetify.lang.t('$vuetify.lang_99') }}</b>
                      </v-card-subtitle>
                      <v-divider />
                      <v-card-text class="red--text">
                        {{ $vuetify.lang.t('$vuetify.lang_98') }}
                      </v-card-text>
                    </v-card>
                  </template>
                  <template v-else>
                    <v-card class="mb-4" elevation="0" outlined>
                      <v-card-text :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">
                        {{ $vuetify.lang.t('$vuetify.lang_110') }}
                      </v-card-text>
                    </v-card>
                    <v-card class="mb-4" elevation="0" outlined>
                      <v-card-text>
                        <v-row align="center">
                          <v-col md="4">
                            <v-component-qrcode :content="item.address" :width="200" />
                          </v-col>
                          <v-col md="8" :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">
                            {{ $vuetify.lang.t('$vuetify.lang_85') }}
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                    <v-text-field :value="item.address" class="mt-4" color="primary" outlined>
                      <template v-slot:append>
                        <v-icon style="cursor: pointer;" @click="$copyText(item.address)">
                          mdi-clipboard-text-multiple-outline
                        </v-icon>
                      </template>
                    </v-text-field>
                  </template>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card class="mb-4" elevation="0" outlined>
                    <v-card-title class="text-uppercase">
                      {{ item.name }}
                      <v-icon class="green--text" v-if="item.status">
                        mdi-check-circle-outline
                      </v-icon>
                      <v-icon class="red--text" v-else>
                        mdi-close-circle-outline
                      </v-icon>
                    </v-card-title>
                    <v-card-subtitle class="text-uppercase" v-if="item.network">
                      {{ $vuetify.lang.t('$vuetify.lang_112') }}: {{ item.network }}
                    </v-card-subtitle>
                    <v-divider />
                    <v-card-subtitle>
                      {{ $vuetify.lang.t('$vuetify.lang_113') }}: <b>{{ item.platform ? item.platform : 'BITCOIN' }}</b>
                    </v-card-subtitle>
                    <v-divider v-if="item.contract" />
                    <v-card-subtitle v-if="item.contract">
                      {{ $vuetify.lang.t('$vuetify.lang_269') }}: {{ item.contract.address }}
                    </v-card-subtitle>
                    <v-divider />
                    <v-card-text :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">
                      {{ $vuetify.lang.t('$vuetify.lang_87').replace(/%1/g, item['confirmation']) }}
                    </v-card-text>
                  </v-card>
                  <v-card elevation="0" outlined>
                    <v-card-subtitle class="text-uppercase">
                      <b class="red--text">{{ $vuetify.lang.t('$vuetify.lang_88').replace(/%1/g, $decimal.truncate(item.fees, 6)).replace(/%2/g, asset['symbol'].toUpperCase()) }}</b>
                    </v-card-subtitle>
                    <v-divider />
                    <v-card-text :class="$vuetify.theme.dark ? 'white--text' : 'black--text'">
                      {{ $vuetify.lang.t('$vuetify.lang_89') }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

            </template>
            <template v-else-if="!overlay">
              <v-layout fill-height style="height:200px;" wrap>
                <v-flex/>
                <v-flex align-self-center class="text-center" md4 mx5 sm6 xl3>
                  <v-btn block color="black--text yellow darken-1 text-capitalize" elevation="0" large @click="setAsset(item.platform, (item.contract ? item.contract.protocol : 'mainnet'), index)">{{ $vuetify.lang.t('$vuetify.lang_288') }}</v-btn>
                </v-flex>
                <v-flex/>
              </v-layout>
            </template>

          </v-tab-item>
        </v-tabs-items>
        <!-- End: tabs items -->

      </template>
      <template v-else>

        <!-- Start: tabs bar -->
        <v-tabs v-model="eyelet" color="primary">
          <v-tab v-for="item in asset.chains" :key="item.id" class="text-capitalize">{{ item.platform }}</v-tab>
        </v-tabs>
        <!-- End: tabs bar -->

        <!-- Start: tabs items -->
        <v-tabs-items v-model="eyelet" class="mt-3">
          <v-tab-item v-for="(item, index) in asset.chains" :key="item.id" :transition="false" class="mt-1">

            <template v-if="item.exist">
              <v-alert icon="mdi-shield-lock-outline" prominent text type="info">
                {{ item }}, Index: {{ index }}
              </v-alert>
            </template>
            <template v-else-if="!overlay">
              <v-layout fill-height style="height:200px;" wrap>
                <v-flex/>
                <v-flex align-self-center class="text-center" md4 mx5 sm6 xl3>
                  <v-btn block color="black--text yellow darken-1 text-capitalize" elevation="0" large @click="setAsset(item.platform, 'mainnet', index)">{{ $vuetify.lang.t('$vuetify.lang_288') }}</v-btn>
                </v-flex>
                <v-flex/>
              </v-layout>
            </template>

          </v-tab-item>
        </v-tabs-items>
        <!-- End: tabs items -->

      </template>
    </template>
    <template v-else>
      <v-alert icon="mdi-shield-lock-outline" prominent text type="error">
        {{ $vuetify.lang.t('$vuetify.lang_212') }}
      </v-alert>
    </template>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.8" :value="overlay">
      <v-progress-circular color="yellow darken-3" indeterminate size="50" />
    </v-overlay>

  </div>
</template>

<script>

  import Qrcode from "~/components/Qrcode";
  import decimal from "../../../plugins/decimal";

  export default {
    components: {
      'v-component-qrcode': Qrcode
    },
    data() {
      return {
        empty: 0,
        asset: {
          chains: []
        },
        eyelet: 0,
        overlay: true,
      }
    },
    watch: {
      $route() {
        this.getAsset();
      }
    },
    mounted() {
      this.getAsset();
    },
    methods: {

      /**
       *
       */
      getAsset() {
        this.overlay = true;
        this.empty = 0;

        this.$axios.$post(this.$api.provider.getAsset, {symbol: this.$route.params.symbol, type: 'spot'}).then((response) => {
          this.asset = response.fields.lastItem ?? {};

          if (this.asset.group === 'crypto') {
            this.asset.chains.map((item) => {
              if (!item.contract) {
                this.empty += 1;
              }
              if (!item.status) {
                item.status = false
              }
            });
          }

          this.overlay = false;
        }).catch(e => {
          console.log(e)
        });
      },

      /**
       * @param platform
       * @param protocol
       * @param index
       */
      setAsset(platform, protocol, index) {
        this.$axios.$post(this.$api.spot.setAsset, {symbol: this.$route.params.symbol, platform: platform, protocol: protocol, group: this.asset.group}).then((response) => {
          if (this.asset.group === 'fiat') {
            for (let i = 0; i < this.asset.chains.length; i++) {
              this.asset.chains[i].exist = true;
            }
          } else {
            this.asset.chains[index].exist = true;
            this.asset.chains[index].address = response.address;
          }
          this.$forceUpdate();
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
