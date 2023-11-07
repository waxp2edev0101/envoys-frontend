<template>
  <v-layout fill-height wrap>
    <v-flex/>
    <v-flex class="text-center" mx5 sm6 md4 align-self-center>
      <v-img class="ma-auto" width="250" src="/asset/5.png" />
      <h1 v-if="error.statusCode === 404">
        {{ this.$vuetify.lang.t('$vuetify.lang_70') }}
      </h1>
      <h1 v-else>
        {{ this.$vuetify.lang.t('$vuetify.lang_71') }}
      </h1>
      <v-divider class="my-4" />
      <template v-if="error.message === 'This page could not be found'">
        <div>{{ this.$vuetify.lang.t('$vuetify.lang_72') }}</div>
      </template>
      <template v-else>
        <div>{{ error.message }}</div>
      </template>
    </v-flex>
    <v-flex/>
  </v-layout>
</template>

<script>

export default {
  layout: 'mono',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    return {
      title: this.error.statusCode === 404 ? this.$vuetify.lang.t('$vuetify.lang_70') : this.$vuetify.lang.t('$vuetify.lang_71')
    }
  }
}

</script>
