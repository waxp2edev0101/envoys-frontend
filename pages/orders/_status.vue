<template>
  <div>

    <!-- Start: tabs bar -->
    <v-tabs class="rounded-lg" color="primary">
      <v-tab exact :to="'/orders/' + $route.params.status" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_64') }}</v-tab>
      <v-tab exact :to="'/orders/' + $route.params.status + '/sale'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_140') }}</v-tab>
      <v-tab exact :to="'/orders/' + $route.params.status + '/purchase'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_141') }}</v-tab>
    </v-tabs>
    <!-- End: tabs bar -->

    <v-divider />

    <!-- Start: child container -->
    <nuxt-child />
    <!-- End: child container -->

  </div>
</template>

<script>
  export default {}
</script>

<style scoped>

</style>