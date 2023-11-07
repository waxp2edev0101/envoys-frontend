<template>

  <!-- Start: stock agent requests component -->
  <v-component-stock-agent-requests />
  <!-- End: stock agent requests component -->

</template>

<script>
  import Requests from "../../components/Stock/Requests";

  export default {
    components: {
      'v-component-stock-agent-requests': Requests
    },
  }
</script>

<style scoped>

</style>