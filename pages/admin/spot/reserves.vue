<template>

  <!-- Start: reserves component -->
  <v-component-reserves />
  <!-- End: reserves component -->

</template>

<script>
import Pairs from "~/components/Admin/Spot/Reserves";

export default {
  components: {
    'v-component-reserves': Pairs
  }
}
</script>

<style scoped>

</style>