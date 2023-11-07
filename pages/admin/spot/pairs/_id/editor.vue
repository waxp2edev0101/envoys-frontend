<template>
  <div class="px-3 mt-3">

    <!-- Start: pair info form -->
    <v-row>
      <v-col align-self="center" class="text-center" cols="12" md="4">
        <v-avatar v-if="pair.base_unit" size="80">
          <v-img :src="$storages(['icon'], pair.base_unit)" />
        </v-avatar>
        <v-avatar v-else color="red darken-1" size="80">
          <span class="white--text text-h5">BU</span>
        </v-avatar>
      </v-col>
      <v-col cols="12" md="4">
        <v-select v-model="pair.base_unit" :items="assets" item-text="symbol" item-value="symbol" @change="getMarketPrice" :label="$vuetify.lang.t('$vuetify.lang_253')" outlined>
          <template v-slot:item="{ item, attrs, on }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-avatar>
                <v-avatar size="30">
                  <v-img :src="$storages(['icon'], item.symbol)" />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-title>
                <div>{{ (item.symbol).toUpperCase() }}</div>
                <div><small>{{ item.name }}</small></div>
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
        <v-select v-model="pair.quote_unit" :items="assets" item-text="symbol" item-value="symbol" @change="getMarketPrice" :label="$vuetify.lang.t('$vuetify.lang_254')" outlined>
          <template v-slot:item="{ item, attrs, on }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-avatar>
                <v-avatar size="30">
                  <v-img :src="$storages(['icon'], item.symbol)" />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-title>
                <div>{{ (item.symbol).toUpperCase() }}</div>
                <div><small>{{ item.name }}</small></div>
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
        <v-text-field v-model="pair.price" color="primary" :loading="loading" :label="$vuetify.lang.t('$vuetify.lang_52')" outlined></v-text-field>
        <v-select v-model="pair.base_decimal" :items="decimals" item-text="name" item-value="value" :label="`Base ${$vuetify.lang.t('$vuetify.lang_260')}`" outlined></v-select>
        <v-select v-model="pair.quote_decimal" :items="decimals" item-text="name" item-value="value" :label="`Quote ${$vuetify.lang.t('$vuetify.lang_260')}`" outlined></v-select>
        <v-select v-model="pair.status" :items="status" item-text="name" item-value="value" :label="$vuetify.lang.t('$vuetify.lang_191')" outlined></v-select>
        <template v-if="$route.params.id !== 'create'">
          <v-switch v-model="pair.graph_clear" :label="$vuetify.lang.t('$vuetify.lang_259')" />
        </template>
      </v-col>
      <v-col align-self="center" class="text-center" cols="12" md="4">
        <v-avatar v-if="pair.quote_unit" size="80">
          <v-img :src="$storages(['icon'], pair.quote_unit)" />
        </v-avatar>
        <v-avatar v-else color="teal darken-1" size="80">
          <span class="white--text text-h5">QU</span>
        </v-avatar>
      </v-col>
    </v-row>
    <!-- End: pair info form -->

    <v-card class="mb-4" outlined>
      <v-simple-table light>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_242') }}
            </th>
            <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_243') }}
            </th>
            <th class="text-left">
              {{ $vuetify.lang.t('$vuetify.lang_244') }}
            </th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_253') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_184') }}</td>
              <td>*</td>
            </tr>
            <tr :class="duplicate ? 'white--text red lighten-2' : ''">
              <td>{{ $vuetify.lang.t('$vuetify.lang_254') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_193') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_260') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_261') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_52') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_256') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_191') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_257') }}</td>
              <td>*</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <template v-if="$route.params.id === 'create'">
      <v-btn block color="black--text yellow darken-1 text-capitalize mb-3" elevation="0" large @click="setPair">{{ $vuetify.lang.t('$vuetify.lang_255') }}</v-btn>
    </template>
    <template v-else>
      <v-btn block color="white--text red darken-1 text-capitalize mb-3" elevation="0" large @click="setPair">{{ $vuetify.lang.t('$vuetify.lang_258') }}</v-btn>
    </template>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        assets: [],
        status: [
          { value: false, name: "OFF" },
          { value: true, name: "ON" },
        ],
        decimals: [
          { value: 2, name: "100.00" },
          { value: 4, name: "100.0000" },
          { value: 6, name: "100.000000" },
          { value: 8, name: "100.00000000" },
        ],
        pair: {
          base_unit: "",
          quote_unit: "",
          price: 0,
          base_decimal: 2,
          quote_decimal: 8,
          status: false,
          graph_clear: false
        },
        loading: false,
        duplicate: false
      }
    },
    mounted() {
      this.getPair();
    },
    methods: {

      /**
       *
       */
      getMarketPrice() {
        if (this.pair.base_unit === this.pair.quote_unit) {
          this.pair.quote_unit = "";
          this.duplicate = true;
        }

        if (this.pair.base_unit && this.pair.quote_unit) {
          this.loading = true;

          this.$axios.$post(this.$api.admin.spot.getMarketPrice, {
            base_unit: this.pair.base_unit,
            quote_unit: this.pair.quote_unit
          }).then((response) => {
            this.pair.price = response.price ?? 0;
            this.loading = false;
            this.duplicate = false;
          })
        }
      },

      /**
       *
       */
      getPair() {
        this.getAssets();

        this.$axios.$post(this.$api.admin.spot.getPair, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0)
        }).then((response) => {
          if (response.fields) {
            this.pair = Object.assign(this.pair, response.fields[0]);
          }
        });
      },

      /**
       *
       */
      setPair() {
        this.$axios.$post(this.$api.admin.spot.setPair, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0),
          pair: this.pair
        }).then(() => {
          return this.$router.push('/admin/spot/pairs');
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
      getAssets() {
        this.$axios.$post(this.$api.admin.spot.getAssets).then((response) => {
          this.assets = response.fields ?? [];
        })
      }
    }
  }
</script>

<style scoped>

</style>