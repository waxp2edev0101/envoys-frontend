<template>
</template>

<script>

  export default {

    mounted() {
      this.init();
    },

    methods: {

      /**
       * Получаем список всех активов.
       */
      init() {
        this.$axios.$post(this.$api.provider.getAssets).then((response) => {
          let items = response.fields ?? [];
          if (!this.$route.params.symbol && items.length) {
            this.$router.push(`/assets/${items[0].symbol}/deposit`);
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>