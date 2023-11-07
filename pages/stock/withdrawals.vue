<template>

  <!-- Start: stock broker withdrawals component -->
  <v-component-stock-broker-withdrawals />
  <!-- End: stock broker withdrawals component -->

</template>

<script>
  import Withdrawals from "../../components/Stock/Withdrawals";

  export default {
    components: {
      'v-component-stock-broker-withdrawals': Withdrawals
    },
  }
</script>

<style scoped>

</style>