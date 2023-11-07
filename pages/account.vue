<template>
  <section class="pa-0 main-role">

    <v-row class="ma-1" no-gutters>

      <!-- Start: assets list component -->
      <v-col class="pa-1" cols="12" md="3" sm="12">
        <v-card class="fill-height rounded-lg" elevation="0">
          <v-card-text>
            <v-list class="pa-0 rounded-menu" rounded>
              <v-list-item-group color="primary">
                <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" v-for="(item, i) in navs" :class="item.to === $route.params.settings ? 'v-list-item--active' : ''"  :key="i" :to="`/account/${item.to}`" exact link>
                  <v-list-item-icon class="mr-3">
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ item.title }}
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- End: assets list component -->

      <!-- Start: child container -->
      <v-col class="pa-1" cols="12" md="9" sm="12">
        <v-card class="fill-height rounded-lg" elevation="0">
          <nuxt-child />
        </v-card>
      </v-col>
      <!-- End: child container -->

    </v-row>

  </section>
</template>

<script>

  export default {
    auth: true,
    computed: {

      /**
       * @returns {[{icon: string, to: string, title: string},{icon: string, to: string, title: string},{icon: string, to: string, title: string},{icon: string, to: string, title: string},{icon: string, to: string, title: string}]}
       */
      navs() {
        return [
          {
            title: this.$vuetify.lang.t('$vuetify.lang_143'),
            icon: "mdi-account-circle-outline",
            to: 'profile'
          }, {
            title: this.$vuetify.lang.t('$vuetify.lang_144'),
            icon: "mdi-shield-lock-outline",
            to: 'security'
          }, {
            title: this.$vuetify.lang.t('$vuetify.lang_145'),
            icon: "mdi-bell-cog-outline",
            to: 'notification'
          }, {
            title: this.$vuetify.lang.t('$vuetify.lang_161'),
            icon: "mdi-account-convert-outline",
            to: 'actions'
          }
        ]
      }
    }
  }
</script>
