<template>

  <!-- Start: balances component -->
  <v-component-balances />
  <!-- End: balances component -->

</template>

<script>
import Balances from "~/components/Admin/Spot/Balances.vue";

export default {
  components: {
    'v-component-balances': Balances
  }
}
</script>

<style scoped>

</style>