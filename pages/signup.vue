<template>
  <v-layout fill-height wrap>
    <v-flex/>
    <v-flex mx5 sm6 md4 xl3 align-self-center>
      <template v-if="loader">
        <template v-if="finish">

          <!-- Start: finish message -->
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none" style="width: 100px;"><path d="M18 8l4 4 4-4-4-4-4 4z" fill="url(#general-success_svg__paint0_linear)"></path><path d="M85 76l3 3 3-3-3-3-3 3z" fill="url(#general-success_svg__paint1_linear)"></path><path d="M86 20l2 2 2-2-2-2-2 2z" fill="url(#general-success_svg__paint2_linear)"></path><path d="M0 47l3 3 3-3-3-3-3 3z" fill="url(#general-success_svg__paint3_linear)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M48 88c22.091 0 40-17.909 40-40S70.091 8 48 8 8 25.909 8 48s17.909 40 40 40zM31 48.335L43.475 61 64 40.241 59.812 36 43.475 52.547l-8.317-8.423L31 48.335z" fill="url(#general-success_svg__paint4_linear)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M48 19c16.016 0 29 12.984 29 29S64.016 77 48 77 19 64.016 19 48s12.984-29 29-29zM31 48.335L43.475 61 64 40.241 59.812 36 43.475 52.547l-8.317-8.423L31 48.335z" fill="url(#general-success_svg__paint5_linear)"></path><defs><linearGradient id="general-success_svg__paint0_linear" x1="22" y1="12" x2="22" y2="4" gradientUnits="userSpaceOnUse"><stop stop-color="#02C076"></stop><stop offset="1" stop-color="#28D294"></stop></linearGradient><linearGradient id="general-success_svg__paint1_linear" x1="88" y1="79" x2="88" y2="73" gradientUnits="userSpaceOnUse"><stop stop-color="#02C076"></stop><stop offset="1" stop-color="#28D294"></stop></linearGradient><linearGradient id="general-success_svg__paint2_linear" x1="88" y1="22" x2="88" y2="18" gradientUnits="userSpaceOnUse"><stop stop-color="#02C076"></stop><stop offset="1" stop-color="#28D294"></stop></linearGradient><linearGradient id="general-success_svg__paint3_linear" x1="3" y1="50" x2="3" y2="44" gradientUnits="userSpaceOnUse"><stop stop-color="#02C076"></stop><stop offset="1" stop-color="#28D294"></stop></linearGradient><linearGradient id="general-success_svg__paint4_linear" x1="8" y1="48" x2="88" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#28D294" stop-opacity="0"></stop><stop offset="1" stop-color="#28D294"></stop></linearGradient><linearGradient id="general-success_svg__paint5_linear" x1="48" y1="77" x2="48" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#02C076"></stop><stop offset="1" stop-color="#28D294"></stop></linearGradient></defs></svg>
            <h2>{{ $vuetify.lang.t('$vuetify.lang_44') }}</h2>
            <div class="mt-2">{{ $vuetify.lang.t('$vuetify.lang_45') }}.</div>
            <v-btn color="black--text yellow darken-1 text-capitalize mt-3" width="200" large elevation="0" :to="'/signin?secure=' + email_code">{{ $vuetify.lang.t('$vuetify.lang_29') }}</v-btn>
          </div>
          <!-- End: finish message -->

        </template>
        <template v-else>

          <!-- Start: init steps component -->
          <v-stepper class="transparent" v-model="next" vertical flat>

            <!-- Start: step auth signup: 1 -->
            <v-stepper-step color="yellow darken-1" :complete="next > 1" step="1">
              {{ $vuetify.lang.t('$vuetify.lang_1') }}
              <small>{{ $vuetify.lang.t('$vuetify.lang_2') }}</small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-form class="mt-2" ref="form">
                <v-text-field color="primary" outlined :label="$vuetify.lang.t('$vuetify.lang_3')" v-model="name" :rules="rulesName" :counter="5" required>
                  <template #message="{ message }">
                    {{ $vuetify.lang.t(message) }}
                  </template>
                </v-text-field>
                <v-text-field color="primary" outlined :label="$vuetify.lang.t('$vuetify.lang_4')" v-model="email" :rules="rulesEmail" required>
                  <template #message="{ message }">
                    {{ $vuetify.lang.t(message) }}
                  </template>
                </v-text-field>
                <v-text-field color="primary" outlined :label="$vuetify.lang.t('$vuetify.lang_5')" v-model="password" :rules="rulesPassword" :counter="8" :append-icon="print ? 'mdi-eye' : 'mdi-eye-off'" :type="print ? 'text' : 'password'" @click:append="print = !print" required>
                  <template #message="{ message }">
                    {{ $vuetify.lang.t(message) }}
                  </template>
                </v-text-field>
                <v-text-field color="primary" outlined :label="$vuetify.lang.t('$vuetify.lang_9')" v-model="confirm" :rules="rulesConfirm" :type="print ? 'text' : 'password'" required>
                  <template #message="{ message }">
                    {{ $vuetify.lang.t(message) }}
                  </template>
                </v-text-field>
                <v-btn color="black--text yellow darken-1 text-capitalize" large block elevation="0" @click="actionSignup(0)">{{ $vuetify.lang.t('$vuetify.lang_40') }}</v-btn>
                <div class="mt-3">{{ $vuetify.lang.t('$vuetify.lang_7') }} <nuxt-link class="orange--text text-decoration-none" to="/signin">{{ $vuetify.lang.t('$vuetify.lang_29') }}</nuxt-link></div>
              </v-form>
            </v-stepper-content>
            <!-- End: step auth signup: 1 -->

            <!-- Start: step auth signup: 2 -->
            <v-stepper-step color="yellow darken-1" :complete="next > 2" step="2">
              {{ $vuetify.lang.t('$vuetify.lang_19') }}
              <small>{{ $vuetify.lang.t('$vuetify.lang_21') }}</small>
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-text-field class="mt-2" color="primary" outlined :label="$vuetify.lang.t('$vuetify.lang_35')" v-model="email_code" :counter="6" :hint="$vuetify.lang.t('$vuetify.lang_43') + email">
                <template v-slot:append>
                  <template v-if="timer === 60 || timer === 0">
                    <span class="my-1" @click="actionSignup(1)" style="cursor: pointer;">{{ $vuetify.lang.t('$vuetify.lang_36') }}</span>
                  </template>
                  <template v-else>
                    <span class="my-1">{{ timer }}</span>
                  </template>
                </template>
              </v-text-field>

              <v-btn v-if="email_code.length === 6" color="black--text yellow darken-1 text-capitalize" large block elevation="0" @click="actionSignup(2)">{{ $vuetify.lang.t('$vuetify.lang_6') }}</v-btn>
            </v-stepper-content>
            <!-- End: step auth signup: 2 -->

          </v-stepper>
          <!-- End: init steps component -->

        </template>
      </template>

    </v-flex>
    <v-flex/>

    <v-overlay absolute :color="$vuetify.theme.dark ? 'grey darken-4' : ''" opacity="0.8" :value="!loader">
      <v-progress-circular color="yellow darken-3" indeterminate size="100" />
    </v-overlay>

  </v-layout>
</template>

<script>

  export default {
    layout: 'mono',
    middleware: 'auth',
    auth: 'guest',
    data() {
      return {
        print: false,
        loader: false,
        finish: false,
        next: 1,
        name: '',
        email: '',
        password: '',
        confirm: '',
        email_code: '',
        timer: 60
      }
    },
    mounted() {
      setTimeout(() => {
        if (this.$auth.loggedIn) {
          return this.$router.push('/assets');
        } else {
          this.loader = true;
        }
      }, 1000);
    },
    methods: {
      actionSignup(task) {
        if (this.$refs.form.validate()) {
          this.$axios.$post(this.$api.auth.actionSignup, {name: this.name, email: this.email, password: this.password, email_code: this.email_code, signup: task}).then(() => {
            switch (task) {
              case 0:
                this.next = 2;
                break;
              case 1:
                this.getTimer();
                break;
              case 2:
                this.finish = true;
                break;
            }
          }).catch((error) => {
            this.$snackbar.open({content: `${error.response.data.code}: ${error.response.data.message}`, color: 'red darken-2'});
          });
        }
      },
      getTimer() {
        if(this.timer > 0) {
          setTimeout(() => {
            this.timer -= 1
            this.getTimer()
          }, 1000);
        } else {
          this.timer = 60;
        }
      }
    },
    computed: {
      rulesName() {
        return [
          (v) => !!v || '$vuetify.lang_10',
          (v) => v.length >= 5 || '$vuetify.lang_11'
        ]
      },
      rulesEmail() {
        return [
          (v) => !!v || '$vuetify.lang_12',
          (v) => /.+@.+/.test(v) || '$vuetify.lang_13'
        ]
      },
      rulesPassword() {
        return [
          (v) => !!v || '$vuetify.lang_14',
          (v) => v.length >= 8 || '$vuetify.lang_16'
        ]
      },
      rulesConfirm() {
        return [
          (v) => !!v || '$vuetify.lang_17',
          (v) => v === this.password || '$vuetify.lang_18'
        ]
      }
    }
  }

</script>

<style scoped>

</style>
