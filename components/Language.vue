<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="$vuetify.theme.dark ? '' : 'deep-purple lighten-4'" elevation="0" icon v-bind="attrs" v-on="on">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon :color="$vuetify.theme.dark ? '' : 'grey darken-1'" v-bind="attrs" v-on="on">
              mdi-translate
            </v-icon>
          </template>
          <span>{{ $vuetify.lang.t('$vuetify.name') }}</span>
        </v-tooltip>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>{{ $vuetify.lang.t('$vuetify.select') }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-radio-group v-model="$vuetify.lang.current" row hide-details>
          <v-radio v-for="(item, name) in this.$vuetify.lang.locales" :key="name" :label="item.name" :value="name" @change="setLanguage(name)"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "v-component-language",
    data() {
      return {
        dialog: false,
      }
    },
    mounted() {
      if (this.$store.state.localStorage.i18n) {
        this.$vuetify.lang.current = this.$store.state.localStorage.i18n;
      }
    },
    methods: {
      setLanguage(name) {
        this.$store.commit('localStorage/setLanguage', this.$vuetify.lang.current = name);

        // Update locale trading view chart.
        if (window.tvWidget !== undefined) {
          window.tvWidget = new window.TradingView.widget(
              Object.assign(window.tvWidget['_options'], { locale: name})
          );
          setTimeout(() => {
            window.tvWidget.chart().createStudy('MA Cross', false, false);
          }, 2000)
        }

        this.dialog = false;
      }
    }
  }
</script>
