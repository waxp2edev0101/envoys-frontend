<template>

  <!-- Start: accounts component -->
  <v-component-accounts />
  <!-- End: accounts component -->

</template>

<script>
  import Accounts from "~/components/Admin/Default/Accounts";

  export default {
    components: {
      'v-component-accounts': Accounts
    }
  }
</script>

<style scoped>

</style>