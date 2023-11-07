<template>
  <div class="px-3 mt-3">

    <!-- Start: user info form -->
    <v-row>
      <v-col cols="12" md="4"></v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="account.name" color="primary" :label="$vuetify.lang.t('$vuetify.lang_188')" outlined></v-text-field>
        <v-text-field v-model="account.email" color="primary" :label="$vuetify.lang.t('$vuetify.lang_280')" outlined></v-text-field>
        <v-select v-model="account.status" :items="status" item-text="name" item-value="value" :label="$vuetify.lang.t('$vuetify.lang_191')" outlined></v-select>
        <v-card class="mb-6" outlined>
          <v-list dense>
            <v-list-group v-if="item[1].length" v-for="(item, i) in Object.entries(rules)" :key="i" :value="false">
              <template v-slot:activator>
                <v-list-item-icon class="mr-3">
                  <v-icon>mdi-contain</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="text-uppercase mr-2">{{ item[0] }} ({{ account.rules[item[0]]?.length ?? 0 }})</v-list-item-title>
              </template>
              <v-list-item @click="setRole(item[0], role)" v-for="role in item[1]" :key="role">
                <v-list-item-title class="text-capitalize">{{ role }}</v-list-item-title>
                <v-list-item-action>
                  <template v-if="getRole(item[0], role)">
                    <v-icon color="blue">
                      mdi-check-decagram
                    </v-icon>
                  </template>
                  <template v-else>
                    <v-icon>
                      mdi-circle-outline
                    </v-icon>
                  </template>
                </v-list-item-action>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card>
        <v-btn block color="white--text red darken-1 text-capitalize mb-3" depressed large @click="setAccount">{{ $vuetify.lang.t('$vuetify.lang_282') }}</v-btn>
      </v-col>
      <v-col cols="12" md="4"></v-col>
    </v-row>
    <!-- End: user info form -->

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
        rules: {
          default: [
            "accounts",
            "advertising",
            "deny-record"
          ],
          spot: [
            "assets",
            "chains",
            "pairs",
            "contracts",
            "reserves",
            "repayments"
          ]
        },
        account: {
          name: "",
          email: "",
          rules: {},
          status: false
        },
      }
    },
    mounted() {
      this.getAccount();
    },
    methods: {

      /**
       * @param name
       * @param value
       */
      setRole(name, value) {

        if (!this.account.rules.hasOwnProperty(name)) {
          this.account.rules[name] = [];
        }

        if (this.getRole(name, value)) {
          this.account.rules[name].splice(this.account.rules[name].map(e => e).indexOf(value), 1);
        } else {
          this.account.rules[name].push(value);
        }

        this.$forceUpdate();
      },

      /**
       * @param name
       * @param value
       * @returns {*}
       */
      getRole(name, value) {
        return this.account.rules[name]?.find((o) => {
          return o === value;
        });
      },

      /**
       *
       */
      getAccount() {
        this.$axios.$post(this.$api.admin.account.getAccount, {id: this.$route.params.id}).then((response) => {
          if (Object.keys(response.fields[0].rules).length === 0) {
            response.fields[0].rules = this.account.rules;
          }
          this.account = Object.assign(this.account, response.fields[0]);
        });
      },

      /**
       *
       */
      setAccount() {
        this.$axios.$post(this.$api.admin.account.setAccount, {
          id: this.account.id,
          user: this.account
        }).then(() => {
          return this.$router.push('/admin/default/accounts');
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