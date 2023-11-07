<template>

  <!-- Start: stock broker agents component -->
  <v-component-stock-broker-agents />
  <!-- End: stock broker agents component -->

</template>

<script>
  import Agents from "@/components/Stock/Agents.vue";

  export default {
    components: {
      'v-component-stock-broker-agents': Agents
    }
  }
</script>

<style scoped>

</style>