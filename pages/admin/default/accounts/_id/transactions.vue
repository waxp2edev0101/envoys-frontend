<template>
  <div>

    <!-- Start: tabs bar -->
    <v-tabs color="primary">
      <v-tab exact :to="'/admin/default/accounts/' + $route.params.id + '/transactions'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_64') }}</v-tab>
      <v-tab exact :to="'/admin/default/accounts/' + $route.params.id + '/transactions/withdrawal'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_121') }}</v-tab>
      <v-tab exact :to="'/admin/default/accounts/' + $route.params.id + '/transactions/deposit'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_120') }}</v-tab>
    </v-tabs>
    <!-- End: tabs bar -->

    <v-divider />

    <!-- Start: child container -->
    <nuxt-child style="height: 100%" />
    <!-- End: child container -->

  </div>
</template>

<script>
  export default {}
</script>

<style scoped>

</style>
