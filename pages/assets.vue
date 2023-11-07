<template>
  <section class="pa-0 main-role">

    <v-row class="ma-1">

      <!-- Start: assets list component -->
      <v-col class="pa-1" cols="12" md="3" sm="12">
        <v-card class="fill-height rounded-lg" elevation="0">
          <v-component-assets />
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

  import Assets from "../components/Asset/Assets";

  export default {
    auth: true,
    components: {
      'v-component-assets': Assets
    },
    async asyncData({ $auth, $vuetify, error }) {
      if(!$auth.$state.user.fields[0].status) {
        error({
          message: $vuetify.lang.t('$vuetify.lang_252')
        });
      }
    },
    beforeDestroy() {

      // Internal event off.
      this.$nuxt.$off('deposit/open/status');
      this.$nuxt.$off('withdraw/cancel');
      this.$nuxt.$off('withdraw/create');
    }
  }
</script>
