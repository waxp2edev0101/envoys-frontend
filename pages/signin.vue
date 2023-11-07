<template>
  <v-layout fill-height wrap>
    <v-flex/>
    <v-flex mx5 sm6 md4 xl3 align-self-center>
      <template v-if="loader">

        <!-- Start: init steps component -->
        <v-stepper class="transparent" v-model="next" vertical flat>

          <!-- Start: step auth signin: 1 -->
          <v-stepper-step color="yellow darken-1" :complete="next > 1" step="1">
            {{ $vuetify.lang.t('$vuetify.lang_25') }}
            <small>{{ $vuetify.lang.t('$vuetify.lang_27') }}</small>
          </v-stepper-step>
          <v-stepper-content step="1">

            <v-form class="mt-2" ref="form">
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
              <v-btn color="black--text yellow darken-1 text-capitalize" large block elevation="0" @click="actionSignin(0)">{{ $vuetify.lang.t('$vuetify.lang_40') }}</v-btn>
              <div class="mt-3"><nuxt-link class="orange--text text-decoration-none" to="/reset">{{ $vuetify.lang.t('$vuetify.lang_28') }}</nuxt-link></div>
              <div class="mt-1"><nuxt-link class="orange--text text-decoration-none" to="/signup">{{ $vuetify.lang.t('$vuetify.lang_26') }}</nuxt-link></div>
            </v-form>
          </v-stepper-content>
          <!-- End: step auth signin: 1 -->

          <!-- Start: step auth signin: 2 -->
          <v-stepper-step :style="next === 3 ? (factor_secure ? 'cursor: pointer' : '') : ''" @click="factor_secure ? next = 2 : null" color="yellow darken-1" :complete="next > 2" step="2">
            {{ $vuetify.lang.t('$vuetify.lang_33') }}
            <small>{{ $vuetify.lang.t('$vuetify.lang_34') }}</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <div>{{ $vuetify.lang.t('$vuetify.lang_35') }}: <span v-if="timer === 60 || timer === 0"><a @click="actionSignin(1)" style="cursor: pointer;">{{ $vuetify.lang.t('$vuetify.lang_36') }}</a></span><span v-else>({{ timer }})</span></div>
            <v-otp-input v-model="email_code" length="6" />
            <v-btn v-if="email_code.length === 6" color="black--text yellow darken-1 text-capitalize" large block elevation="0" @click="factor_secure ? next = 3 : actionSignin(2)">{{ factor_secure ? $vuetify.lang.t('$vuetify.lang_40') : $vuetify.lang.t('$vuetify.lang_29') }}</v-btn>
          </v-stepper-content>
          <!-- End: step auth signin: 2 -->

          <!-- Start: step auth signin: 3 -->
          <v-stepper-step v-if="factor_secure" color="yellow darken-1" :complete="next > 3" step="3">
            {{ $vuetify.lang.t('$vuetify.lang_294') }}
            <small>{{ $vuetify.lang.t('$vuetify.lang_312') }}</small>
          </v-stepper-step>
          <v-stepper-content v-if="factor_secure" step="3">
            <div>{{ $vuetify.lang.t('$vuetify.lang_308') }}</div>
            <v-otp-input v-model="factor_code" length="6" />
            <v-btn v-if="factor_code.length === 6" color="black--text yellow darken-1 text-capitalize" large block elevation="0" @click="actionSignin(2)">{{ $vuetify.lang.t('$vuetify.lang_29') }}</v-btn>
          </v-stepper-content>
          <!-- End: step auth signin: 3 -->

        </v-stepper>
        <!-- End: init steps component -->

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
        next: 1,
        email: '',
        password: '',
        email_code: '',
        factor_secure: false,
        factor_code: '',
        timer: 60
      }
    },
    mounted() {
      if (this.$route.query.secure) {
        this.email_code = this.$route.query.secure;
      }
      setTimeout(() => {
        if (this.$auth.loggedIn) {
          return this.$router.push('/assets');
        } else {
          this.loader = true;
        }
      }, 1000);
    },
    methods: {
      actionSignin(task) {
        if (task === 0 || task === 1) {
          if (this.$refs.form.validate()) {
            this.$axios.$post(this.$api.auth.actionSignin, {email: this.email, password: this.password, email_code: this.email_code, factor_code: this.factor_code, signin: task}).then(() => {
              switch (task) {
                case 0:
                  this.getSecure();
                  this.next = 2;
                  break;
                case 1:
                  this.getTimer();
                  break;
              }
            }).catch((error) => {
              this.$snackbar.open({content: `${error.response.data.code}: ${error.response.data.message}`, color: 'red darken-2'});
            });
          }
        } else {
          this.$auth.loginWith('local', { data: {email: this.email, password: this.password, email_code: this.email_code, factor_code: this.factor_code, signin: task} }).catch((error) => {
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
      },
      getSecure() {
        this.$axios.$post(this.$api.auth.getSecure, {email: this.email, password: this.password}).then((response) => {
          this.factor_secure = response.factor_secure ?? false;
        });
      }
    },
    computed: {
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
      }
    }
  }

</script>

<style scoped>

</style>
