<template>

  <!-- Start: transactions component -->
  <v-component-transactions />
  <!-- End: transactions component -->

</template>

<script>
  import Transactions from "~/components/Admin/Spot/Transactions.vue";

  export default {
    components: {
      'v-component-transactions': Transactions
    }
  }
</script>

<style scoped>

</style>