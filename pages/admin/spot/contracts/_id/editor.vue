<template>
  <div class="px-3 mt-3">

    <!-- Start: contract info form -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field v-model="contract.address" color="primary" :label="$vuetify.lang.t('$vuetify.lang_269')" outlined></v-text-field>
        <v-select v-model="contract.protocol" :items="protocols" item-text="name" item-value="name" :label="$vuetify.lang.t('$vuetify.lang_270')" outlined>
          <template v-slot:item="{ item, attrs, on }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-title>
                {{ item.name }} <v-badge class="ml-2" :color="item.color" />
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select v-model="contract.symbol" :items="assets" item-text="symbol" item-value="symbol" :label="$vuetify.lang.t('$vuetify.lang_187')" outlined>
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
        <v-select v-model="contract.chain_id" :items="chains" item-text="name" item-value="id" @change="getProtocol" :label="$vuetify.lang.t('$vuetify.lang_268')" outlined></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="contract.fees" color="primary" :label="$vuetify.lang.t('$vuetify.lang_221')" outlined></v-text-field>
        <v-text-field v-model="contract.decimals" color="primary" :label="$vuetify.lang.t('$vuetify.lang_293')" outlined></v-text-field>
      </v-col>
    </v-row>
    <!-- End: contract info form -->

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
            <td>{{ $vuetify.lang.t('$vuetify.lang_269') }}, {{ $vuetify.lang.t('$vuetify.lang_270') }}</td>
            <td>{{ $vuetify.lang.t('$vuetify.lang_275') }}</td>
            <td>*</td>
          </tr>
          <tr>
            <td>{{ $vuetify.lang.t('$vuetify.lang_187') }}</td>
            <td>{{ $vuetify.lang.t('$vuetify.lang_276') }}</td>
            <td>*</td>
          </tr>
          <tr>
            <td>{{ $vuetify.lang.t('$vuetify.lang_268') }}</td>
            <td>{{ $vuetify.lang.t('$vuetify.lang_277') }}</td>
            <td>*</td>
          </tr>
          <tr>
            <td>{{ $vuetify.lang.t('$vuetify.lang_221') }}</td>
            <td>{{ $vuetify.lang.t('$vuetify.lang_278') }}</td>
            <td>*</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <template v-if="$route.params.id === 'create'">
      <v-btn block color="black--text yellow darken-1 text-capitalize mb-3" elevation="0" large @click="setContract">{{ $vuetify.lang.t('$vuetify.lang_267') }}</v-btn>
    </template>
    <template v-else>
      <v-btn block color="white--text red darken-1 text-capitalize mb-3" elevation="0" large @click="setContract">{{ $vuetify.lang.t('$vuetify.lang_274') }}</v-btn>
    </template>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        assets: [],
        chains: [],
        protocols: this.$protocol.list || [],
        contract: {
          symbol: "",
          chain_id: 0,
          address: "",
          fees: 0.01,
          decimals: 6,
          protocol: "erc20",
          platform: "ethereum"
        }
      }
    },
    mounted() {
      this.getContract();
      this.getChains();
    },
    methods: {

      /**
       *
       */
      getContract() {
        this.$axios.$post(this.$api.admin.spot.getContract, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0)
        }).then((response) => {
          if (response.fields) {
            this.contract = Object.assign(this.contract, response.fields[0]);
          }
        });
      },

      /**
       *
       */
      setContract() {
        this.$axios.$post(this.$api.admin.spot.setContract, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0),
          contract: this.contract
        }).then(() => {
          return this.$router.push('/admin/spot/contracts');
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
        this.getAssets();

        this.$axios.$post(this.$api.admin.spot.getChains).then((response) => {
          this.chains = response.fields?.filter((item) => item.platform !== 'visa' && item.platform !== 'mastercard' && item.platform !== 'bitcoin');

          this.getProtocol();
        })
      },

      /**
       *
       */
      getAssets() {
        this.$axios.$post(this.$api.admin.spot.getAssets).then((response) => {
          this.assets = response.fields ?? [];
        })
      },

      /**
       *
       */
      getProtocol() {
        let chain = this.chains.find((item) => item.id === this.contract.chain_id);
        this.protocols = this.$protocol.getTag(chain?.tag ?? 'erc20');
        if (this.protocols.length) {
          this.contract.platform = chain.platform;
          this.contract.protocol = this.protocols[0].name;
        }
      }
    }
  }
</script>

<style scoped>

</style>