<template>
  <span>
    <v-btn :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" @click="setTheme" icon>
      <template v-if="this.$vuetify.theme.dark">
        <v-icon>
          mdi-brightness-1
        </v-icon>
      </template>
      <template v-else>
        <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-1'">
          mdi-brightness-3
        </v-icon>
      </template>
    </v-btn>
  </span>
</template>

<script>
export default {
  name: "v-component-theme",
  mounted() {
    this.getTheme();
  },
  methods: {
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$store.commit('localStorage/setTheme', !this.$store.state.localStorage.dark);

      // Trading view widget change theme.
      if (window.tvWidget !== undefined && this.$route.name === 'trade-unit') {
        window.tvWidget.changeTheme(this.$vuetify.theme.dark ? "Dark" : "Light");
      }
    },
    getTheme() {
      this.$vuetify.theme.dark = this.$store.state.localStorage.dark;
    }
  }
}
</script>
