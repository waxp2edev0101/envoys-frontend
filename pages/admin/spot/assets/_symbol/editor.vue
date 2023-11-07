<template>
  <div class="px-3 mt-3">

    <v-row align="center">
      <v-col cols="12" md="4">

        <v-card height="80" outlined rounded="lg">

          <!-- Start: icon crypto -->
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar color="indigo">
                  <template v-if="asset.icon">
                    <v-img :src="image" />
                  </template>
                  <template v-else>
                    <span class="white--text text-h5">{{ asset.symbol }}</span>
                  </template>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ asset.symbol ? asset.symbol.toUpperCase() : $vuetify.lang.t('$vuetify.lang_205') }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ asset.name ? asset.name : $vuetify.lang.t('$vuetify.lang_206') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <!-- End: icon crypto -->

        </v-card>

      </v-col>
      <v-col cols="12" md="4" align-self="center">
        <v-card height="80" outlined rounded="lg">
          <v-card-title class="mt-2">
            {{ $vuetify.lang.t('$vuetify.lang_148') }} {{ asset.fees_trade }}%
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" align-self="center">
        <v-card height="80" outlined rounded="lg">
          <v-card-title class="mt-2">
            {{ $vuetify.lang.t('$vuetify.lang_149') }} {{ asset.fees_discount ? $decimal.truncate($decimal.sub(asset.fees_trade, asset.fees_discount)) : 0 }}%
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <!-- Start: crypto info form -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field v-model="asset.name" color="primary" :label="$vuetify.lang.t('$vuetify.lang_188')" outlined></v-text-field>
        <v-text-field v-model="asset.max_withdraw" color="primary" :label="$vuetify.lang.t('$vuetify.lang_198')" outlined></v-text-field>
        <v-text-field v-model="asset.max_trade" color="primary" :label="$vuetify.lang.t('$vuetify.lang_199')" outlined></v-text-field>
        <v-select v-model="asset.marker" :items="marker" item-text="name" item-value="value" :label="$vuetify.lang.t('$vuetify.lang_190')" outlined></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="asset.symbol" color="primary" :label="$vuetify.lang.t('$vuetify.lang_187')" outlined></v-text-field>
        <v-text-field v-model="asset.fees_trade" color="primary" :label="$vuetify.lang.t('$vuetify.lang_201')" outlined></v-text-field>
        <v-select v-model="asset.status" :items="status" item-text="name" item-value="value" :label="$vuetify.lang.t('$vuetify.lang_191')" outlined></v-select>
        <v-select v-model="asset.type" :items="type" item-text="name" item-value="name" :label="$vuetify.lang.t('$vuetify.lang_208')" outlined></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="asset.min_withdraw" color="primary" :label="$vuetify.lang.t('$vuetify.lang_202')" outlined></v-text-field>
        <v-text-field v-model="asset.min_trade" color="primary" :label="$vuetify.lang.t('$vuetify.lang_203')" outlined></v-text-field>
        <v-text-field v-model="asset.fees_discount" color="primary" :label="$vuetify.lang.t('$vuetify.lang_207')" outlined></v-text-field>
        <v-select v-model="asset.chains_ids" :items="chains" item-text="name" item-value="id" :label="$vuetify.lang.t('$vuetify.lang_179')" multiple outlined>
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0">
              <span>{{ item.name }}</span>
            </v-chip>
            <span v-if="index === 1" class="grey--text text-caption">
              (+{{ asset.chains_ids.length - 1 }} others)
            </span>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <!-- End: crypto info form -->

    <v-file-input counter chips show-size truncate-length="34" outlined @change="onChange" />

    <template v-if="$route.params.symbol === 'create'">
      <v-btn v-if="image" block color="black--text yellow darken-1 text-capitalize mb-3" elevation="0" large @click="setAsset">{{ $vuetify.lang.t('$vuetify.lang_195') }}</v-btn>
    </template>
    <template v-else>
      <v-btn block color="white--text red darken-1 text-capitalize mb-3" elevation="0" large @click="setAsset">{{ $vuetify.lang.t('$vuetify.lang_204') }}</v-btn>
    </template>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        chains: [],
        status: [
          { value: false, name: "OFF" },
          { value: true, name: "ON" },
        ],
        type: [
          { name: "CRYPTO" },
          { name: "FIAT" },
        ],
        marker: [
          { value: false, name: "OFF" },
          { value: true, name: "ON" },
        ],
        asset: {
          name: "",
          symbol: "",
          min_withdraw: 0.0001,
          max_withdraw: 100,
          min_trade: 0.0100,
          max_trade: 1000000,
          fees_trade: 0.1500,
          fees_discount: 0.0500,
          marker: false,
          chains_ids: [],
          icon: false,
          type: "CRYPTO",
          status: false
        },
        image: "",
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
        this.$axios.$post(this.$api.admin.spot.getAsset, {
          symbol: (this.$route.params.symbol !== "create" ? this.$route.params.symbol : "")
        }).then((response) => {
          if (response.fields) {
            this.asset = Object.assign(this.asset, response.fields[0]);
            for (let i = 0; i < this.asset.chains_ids.length; i++) {
              this.asset.chains_ids[i] = (this.asset.chains_ids[i]).toString()
            }
            this.image = this.$storages(['icon'], this.asset.symbol);

            this.getChains();
          }
        });
      },

      /**
       *
       */
      setAsset() {
        if (this.asset.chains_ids === null) {
          this.asset.chains_ids = []
        }
        this.$axios.$post(this.$api.admin.spot.setAsset, {
          symbol: (this.$route.params.symbol !== "create" ? this.$route.params.symbol : ""),
          image: this.image.split(',')[1],
          asset: this.asset
        }).then(() => {
          return this.$router.push('/admin/spot/assets');
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
      getChains() {
        this.$axios.$post(this.$api.admin.spot.getChains).then((response) => {
          this.chains = response.fields ?? [];
        })
      },

      /**
       * @param file
       */
      setImage(file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.image = e.target.result;
          this.asset.icon = true;
        };
        reader.readAsDataURL(file);
      },

      /**
       * @param file
       */
      onChange(file) {
        if (!file) {
          this.image = "";
          return;
        }
        this.setImage(file);
      }
    }
  }
</script>

<style scoped>

</style>