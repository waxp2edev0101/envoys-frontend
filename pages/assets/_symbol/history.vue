<template>
  <div>

    <!-- Start: tabs bar -->
    <v-tabs class="px-4 mt-4" color="primary">
      <v-tab exact :to="'/assets/' + $route.params.symbol + '/history'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_64') }}</v-tab>
      <v-tab exact :to="'/assets/' + $route.params.symbol + '/history/withdrawal'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_121') }}</v-tab>
      <v-tab exact :to="'/assets/' + $route.params.symbol + '/history/deposit'" class="text-capitalize">{{ $vuetify.lang.t('$vuetify.lang_120') }}</v-tab>
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
