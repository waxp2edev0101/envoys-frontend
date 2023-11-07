<template>
  <v-footer v-if="$route.name !== 'trade-exchange'" color="transparent" padless>
    <v-col class="text-center" cols="12">
      Exchange &copy; {{ new Date().getFullYear() }}
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "v-component-footer"
}
</script>

<style scoped>
</style>