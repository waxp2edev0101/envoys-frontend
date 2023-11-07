<template>
  <v-container>
    <div class="kyc">
      <v-row no-gutters>
        <v-col cols="12" md="12" sm="12">
          <div class="text-center mb-6">
            {{ $vuetify.lang.t('$vuetify.lang_357') }}
          </div>
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <div class="text-center">
            <v-img style="margin: 0 auto;" max-width="400" src="/png/1.png"></v-img>
            <v-btn style="text-transform: none !important;" :disabled="blocks.standard.secure" @click="setKyc(1, 0)" color="black--text yellow darken-1 text-capitalize" large elevation="0">
              Standard <v-icon v-if="blocks.standard.secure">mdi-check-all</v-icon>
            </v-btn>
            <v-alert icon="mdi-information-outline" class="mt-5 mx-2 text-caption">
              {{ $vuetify.lang.t('$vuetify.lang_358').replace(/%1/g, blocks.standard.multiplication).replace(/%2/g, "Standard").replace(/%3/g, $decimal.mul(100, blocks.standard.multiplication)) }}
            </v-alert>
          </div>
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <div class="text-center">
            <v-img style="margin: 0 auto;" max-width="400" src="/png/2.png"></v-img>
            <v-btn style="text-transform: none !important;" :disabled="blocks.premium.secure" @click="setKyc(2, 0)" color="black--text yellow darken-1 text-capitalize" large elevation="0">
              Premium <v-icon v-if="blocks.premium.secure">mdi-check-all</v-icon>
            </v-btn>
            <v-alert icon="mdi-information-outline" class="mt-5 mx-2 text-caption">
              {{ $vuetify.lang.t('$vuetify.lang_358').replace(/%1/g, blocks.premium.multiplication).replace(/%2/g, "Premium").replace(/%3/g, $decimal.mul(100, blocks.premium.multiplication)) }}
            </v-alert>
          </div>
        </v-col>

        <v-col cols="12" md="4" sm="12">
          <div class="text-center">
            <v-img style="margin: 0 auto;" max-width="400" src="/png/3.png"></v-img>
            <v-btn style="text-transform: none !important;" :disabled="blocks.corporate.secure" @click="setKyc(3, 1)" color="black--text yellow darken-1 text-capitalize" large elevation="0">
              Corporate <v-icon v-if="blocks.corporate.secure">mdi-check-all</v-icon>
            </v-btn>
            <v-alert icon="mdi-information-outline" class="mt-5 mx-2 text-caption">
              {{ $vuetify.lang.t('$vuetify.lang_358').replace(/%1/g, blocks.corporate.multiplication).replace(/%2/g, "Corporate").replace(/%3/g, $decimal.mul(100, blocks.corporate.multiplication)) }}
            </v-alert>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : 'white'" opacity="0.9" :value="process">
      <div class="text-center">
        <v-progress-circular color="yellow darken-3" indeterminate size="100" />
      </div>
      <div class="mt-5 black--text text-center">
        {{ $vuetify.lang.t('$vuetify.lang_348') }} <a :href="$store.state.localStorage.url" target="_blank">verification form.</a>
        <div>
          {{ $vuetify.lang.t('$vuetify.lang_359') }}
        </div>
        <v-btn @click="setCanceled" class="mt-5" color="black--text yellow darken-1 text-capitalize" large elevation="0">
          {{ $vuetify.lang.t('$vuetify.lang_360') }}
        </v-btn>
      </div>
    </v-overlay>
  </v-container>
</template>

<script>
  export default {
    auth: true,
    data() {
      return {
        type: null,
        process: false,
        blocks: {
          standard: {
            multiplication: 0,
            secure: false
          },
          premium: {
            multiplication: 0,
            secure: false
          },
          corporate: {
            multiplication: 0,
            secure: false
          }
        }
      }
    },
    mounted() {

      this.$publish.bind('account/kyc-verify', (data) => {
        if (data.id === Number(this.$auth.$state.user.fields[0].id)) {
          switch (data.type) {
            case "error":
              this.$nuxt.error({ statusCode: 404, message: this.messages.join('. ') });
              break
            case "pending":
              this.process = true;
              break
            case "completed":
              this.blocks[this.type].secure = true;
              this.process = false;
              this.$store.commit('localStorage/setUrl', null);
              break
          }
        }
      });

      this.getPrivilege();
    },
    methods: {

      /**
       * @param type
       * @param form
       */
      setKyc(type, form) {
        this.$axios.$post(this.$api.kyc.setProcess, {form: form, type: type}).then((response) => {
          this.process = true;
          this.$store.commit('localStorage/setUrl', response.form_url + "/?lang=en");
          window.open(response.form_url + "/?lang=en", "_blank");
        });
      },

      /**
       *
       */
      getPrivilege() {
        this.$axios.$post(this.$api.kyc.getPrivilege).then((response) => {
          for (const [key, value] of Object.entries(response.multiplication)) {
            this.blocks[key].multiplication = value
          }
          this.getStatus();
        });
      },

      /**
       *
       */
      getStatus() {
        this.$axios.$post(this.$api.kyc.getStatus, {id: this.$auth.$state.user.fields[0].id}).then((response) => {
          if (Object.keys(response).length > 0) {
            let type = String(response.type).toLowerCase();

            if (type !== 'undefined') {
              this.type = type;
              this.blocks[type].secure = response.secure ?? false;
              this.process = response.process ?? false;

              if (response.secure) {
                switch (type) {
                  case 'premium':
                    this.blocks['standard'].secure = true;
                    break
                  case 'corporate':
                    this.blocks['standard'].secure = true;
                    this.blocks['premium'].secure = true;
                    break
                }
              }
            }
          }
        });
      },

      /**
       *
       */
      setCanceled() {
        this.$axios.$post(this.$api.kyc.setCanceled).then((response) => {
          if (response.success) {
            this.process = false;
          }
        });
      }
    }
  }
</script>

<style scoped>
    .kyc {
      height: calc(100vh - 64px);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @media only screen and (max-width: 960px) {
      .kyc {
        height: auto !important;
      }
    }

</style>