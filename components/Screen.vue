<template>
  <span v-if="$route.name === 'trade-unit' && $route.query.type === 'spot'" class="hidden-sm-and-down hidden-md-and-down hidden-lg-and-down">
    <v-btn :color="$store.state.localStorage.screen ? '' : 'deep-purple lighten-4'" @click="setScreen" icon>
      <template v-if="$store.state.localStorage.screen">
        <v-icon>
          mdi-arrow-collapse-all
        </v-icon>
      </template>
      <template v-else>
        <v-icon :color="$store.state.localStorage.screen ? '' : 'grey darken-1'">
          mdi-arrow-expand-all
        </v-icon>
      </template>
    </v-btn>
  </span>
</template>

<script>
export default {
  name: "v-component-screen",
  methods: {
    setScreen() {
      this.$store.commit('localStorage/setScreen', !this.$store.state.localStorage.screen);
    }
  }
}
</script>
