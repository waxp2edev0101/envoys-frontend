<template>
  <v-layout fill-height wrap>
    <v-flex/>
    <v-flex align-self-center class="text-center relative mx-4 my-16" md5 mx5 sm6 xl4>
      <v-switch
          v-model="sample"
          color="primary"
          :label="$vuetify.lang.t('$vuetify.lang_167')"
          :messages="$vuetify.lang.t('$vuetify.lang_168')"
          value="order_filled"
          @click="setSample('order_filled')"
      ></v-switch>
      <v-switch
          v-model="sample"
          color="primary"
          :label="$vuetify.lang.t('$vuetify.lang_165')"
          :messages="$vuetify.lang.t('$vuetify.lang_166')"
          value="withdrawal"
          @click="setSample('withdrawal')"
      ></v-switch>
      <v-switch
          v-model="sample"
          color="primary"
          :label="$vuetify.lang.t('$vuetify.lang_169')"
          :messages="$vuetify.lang.t('$vuetify.lang_170')"
          value="login"
          @click="setSample('login')"
      ></v-switch>
      <v-switch
          v-model="sample"
          color="primary"
          :label="$vuetify.lang.t('$vuetify.lang_163')"
          :messages="$vuetify.lang.t('$vuetify.lang_164')"
          value="news"
          @click="setSample('news')"
      ></v-switch>
    </v-flex>
    <v-flex/>
  </v-layout>
</template>

<script>

  export default {
    data() {
      return {
        sample: []
      }
    },
    watch: {
      $route() {
        this.getUser();
      }
    },
    mounted() {
      this.getUser();
    },
    methods: {

      /**
       *
       */
      getUser() {
        this.$axios.$post(this.$api.account.getUser).then((response) => {
          this.sample = response.fields[0].sample ?? [];
        });
      },

      /**
       * @param e
       */
      setSample(e) {
        this.$axios.$post(this.$api.account.setUser, {
          sample: e
        });
      }
    }
  }
</script>

<style scoped>

  .relative {
    position: relative;
    z-index: 6;
  }

</style>