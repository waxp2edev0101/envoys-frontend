<template>
  <section class="pa-0 main-role">

    <v-row class="ma-1" no-gutters>

      <!-- Start: nav list component -->
      <v-col class="pa-1" cols="12" md="3" sm="12">
        <v-card class="fill-height rounded-lg" elevation="0">
          <v-component-menu-admin />
        </v-card>
      </v-col>
      <!-- End: nav list component -->

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

  import AdminMenu from "~/components/Menu/Admin";

  export default {
    auth: true,
    middleware: ['rules'],
    components: {
      'v-component-menu-admin': AdminMenu,
    },
  }
</script>

<style scoped>

</style>