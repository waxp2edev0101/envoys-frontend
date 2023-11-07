<template>
  <div class="px-3 mt-3">

    <!-- Start: chain info form -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field v-model="chain.name" color="primary" :label="$vuetify.lang.t('$vuetify.lang_188')" outlined></v-text-field>
        <v-select v-model="chain.platform" :items="$platform.list" item-text="name" item-value="name" :label="$vuetify.lang.t('$vuetify.lang_113')" outlined></v-select>
        <v-select v-model="chain.status" :items="status" item-text="name" item-value="value" :label="$vuetify.lang.t('$vuetify.lang_191')" outlined></v-select>
        <v-text-field v-model="chain.rpc" color="primary" :label="$vuetify.lang.t('$vuetify.lang_219')" outlined></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="chain.explorer_link" color="primary" :label="$vuetify.lang.t('$vuetify.lang_224')" outlined></v-text-field>
        <v-text-field v-model="chain.confirmation" color="primary" :label="$vuetify.lang.t('$vuetify.lang_153')" outlined></v-text-field>
        <v-text-field v-model="chain.time_withdraw" color="primary" :label="$vuetify.lang.t('$vuetify.lang_225')" outlined></v-text-field>
        <v-select v-model="chain.tag" :items="$tag.list" item-text="name" item-value="name" :label="$vuetify.lang.t('$vuetify.lang_283')" outlined />
        <v-text-field v-model="chain.decimals" color="primary" :label="$vuetify.lang.t('$vuetify.lang_293')" outlined></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="chain.fees" color="primary" :label="$vuetify.lang.t('$vuetify.lang_221')" :hint="$vuetify.lang.t('$vuetify.lang_353')" outlined></v-text-field>
        <v-text-field v-model="chain.network" color="primary" :label="$vuetify.lang.t('$vuetify.lang_112')" outlined></v-text-field>
        <v-select v-if="$platform.get(chain.platform).group === 'crypto'" v-model="chain.parent_symbol" :items="assets" item-text="symbol" item-value="symbol" :label="$vuetify.lang.t('$vuetify.lang_286')" outlined>
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
        <v-text-field v-if="$platform.get(chain.platform).group === 'crypto'" v-model="chain.block" :label="$vuetify.lang.t('$vuetify.lang_220')" outlined></v-text-field>
      </v-col>
    </v-row>
    <!-- End: chain info form -->

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
              <td>{{ $vuetify.lang.t('$vuetify.lang_188') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_231') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_221') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_232') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_113') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_233') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_153') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_234') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_112') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_235') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_191') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_236') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_219') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_237') }}</td>
              <td>*</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_224') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_238') }}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>{{ $vuetify.lang.t('$vuetify.lang_225') }}</td>
              <td>{{ $vuetify.lang.t('$vuetify.lang_239') }}</td>
              <td>-</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <template v-if="$route.params.id === 'create'">
      <v-btn block color="black--text yellow darken-1 text-capitalize mb-3" elevation="0" large @click="setChain">{{ $vuetify.lang.t('$vuetify.lang_218') }}</v-btn>
    </template>
    <template v-else>
      <v-btn block color="white--text red darken-1 text-capitalize mb-3" elevation="0" large @click="setChain">{{ $vuetify.lang.t('$vuetify.lang_226') }}</v-btn>
    </template>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        status: [
          { value: false, name: "OFF"},
          { value: true, name: "ON"},
        ],
        assets: [],
        chain: {
          name: "",
          rpc: "",
          explorer_link: "",
          network: 0,
          decimals: 18,
          confirmation: 0,
          time_withdraw: 10,
          status: false,
          fees: 0,
          parent_symbol: "",
          tag: "tag_none",
          platform: "ethereum"
        }
      }
    },
    mounted() {
      this.getChain();
    },
    methods: {

      /**
       *
       */
      getChain() {
        this.getAssets();

        this.$axios.$post(this.$api.admin.spot.getChain, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0)
        }).then((response) => {
          if (response.fields) {
            this.chain = Object.assign(this.chain, response.fields[0]);
          }
        });
      },

      /**
       *
       */
      setChain() {
        this.$axios.$post(this.$api.admin.spot.setChain, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0),
          chain: this.chain
        }).then(() => {
          return this.$router.push('/admin/spot/chains');
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