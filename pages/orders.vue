<template>
  <section class="pa-0 main-role">

    <v-row class="ma-1">

      <!-- Start: assets list component -->
      <v-col class="pa-1" cols="12" md="3" sm="12">
        <v-card class="fill-height rounded-lg" elevation="0">
          <v-card-text>
            <v-list class="pa-0 rounded-menu" rounded>
              <v-list-item-group color="primary">
                <v-list-item :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" v-for="(item, i) in navs" :class="item.status === $route.params.status ? 'v-list-item--active' : ''"  :key="i" :to="`/orders/${item.status}`" exact link>
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
       * @returns {[{title: string, status: string},{title: string, status: string},{title: string, status: string}]}
       */
      navs() {
        return [
          {
            title: this.$vuetify.lang.t('$vuetify.lang_138'),
            icon: "mdi-archive-search-outline",
            status: 'all'
          }, {
            title: this.$vuetify.lang.t('$vuetify.lang_136'),
            icon: "mdi-archive-clock-outline",
            status: 'pending'
          }, {
            title: this.$vuetify.lang.t('$vuetify.lang_137'),
            icon: "mdi-archive-star-outline",
            status: 'filled'
          }
        ]
      }
    }
  }
</script>
