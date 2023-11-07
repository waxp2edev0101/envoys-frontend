<template>
  <v-menu v-show="$auth.loggedIn" max-width="300" offset-x offset-y bottom center content-class="mt-5 elevation-1 rounded-lg" transition="slide-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="$vuetify.theme.dark ? '' : 'blue lighten-4'" elevation="0" icon v-bind="attrs" v-on="on">
        <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-1'">
          mdi-account-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <template v-if="$auth.loggedIn">
        <v-list :color="$vuetify.theme.dark ? 'grey darken-4' : ''">
          <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'">
            <v-list-item-icon class="mr-2">
              <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-2'" size="40">mdi-account-circle-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title :class="$vuetify.theme.dark ? 'ml-2' : 'ml-2 brown--text'">{{ $auth.$state.user.fields[0].name }}</v-list-item-title>
              <v-list-item-subtitle :class="$vuetify.theme.dark ? 'ml-2' : 'ml-2 grey--text'">{{ $auth.$state.user.fields[0].email }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn to="/account/profile" elevation="0" icon>
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <v-divider />
      <v-card-text>
        <v-list class="pa-0 rounded-menu" rounded>
          <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" v-for="(item, index) in items" :key="index" :to="item.to" nuxt>
            <v-list-item-icon class="mr-2" size="30">
              <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-2'" v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title :class="$vuetify.theme.dark ? 'ml-2' : 'ml-2 brown--text'">{{ $vuetify.lang.t(`$vuetify.${item.title}`) }}</v-list-item-title>
          </v-list-item>
          <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" @click="this.setLogout" link>
            <v-list-item-icon class="mr-2" size="30">
              <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-2'">mdi-location-exit</v-icon>
            </v-list-item-icon>
            <v-list-item-title :class="$vuetify.theme.dark ? 'ml-2' : 'ml-2 brown--text'">{{ $vuetify.lang.t('$vuetify.lang_8') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
  export default {
    name: "v-component-menu-private",
    data() {
      return {
        items: [
          {icon: 'mdi-auto-mode', title: 'lang_79', to: '/assets'},
          {icon: 'mdi-bank-outline', title: 'lang_364', to: '/stock'},
          {icon: 'mdi-order-bool-descending', title: 'lang_126', to: '/orders/all'},
          {icon: 'mdi-shield-account-outline', title: 'lang_345', to: '/kyc'}
        ],
      }
    },
    methods: {
      setLogout() {
        this.$auth.logout({ data: {refresh: this.$auth.$storage['_state']['_refresh_token.local'], email: this.$auth.$state.user.fields[0].email}}).then(() => {
          this.$router.push('/');
        });
      }
    }
  }
</script>

<style>

</style>
