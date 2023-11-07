<template>

  <!-- Start: dashboard component -->
  <v-component-spot-dashboard />
  <!-- End: dashboard component -->

</template>

<script>
  import Dashboard from "../../components/Admin/Spot/Dashboard.vue";

  export default {
    name: "index",
    components: {
      'v-component-spot-dashboard': Dashboard
    },
  }
</script>

<style scoped>

</style>