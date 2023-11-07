<template>

  <!-- Start: orders component -->
  <v-component-orders />
  <!-- End: orders component -->

</template>

<script>
  import Orders from "~/components/Orders";

  export default {
    components: {
      'v-component-orders': Orders
    }
  }
</script>

<style scoped>

</style>