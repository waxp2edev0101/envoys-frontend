<template>

  <!-- Start: repayments component -->
  <v-component-repayments />
  <!-- End: repayments component -->

</template>

<script>
  import Pairs from "~/components/Admin/Spot/Repayments";

  export default {
    components: {
      'v-component-repayments': Pairs
    }
  }
</script>

<style scoped>

</style>