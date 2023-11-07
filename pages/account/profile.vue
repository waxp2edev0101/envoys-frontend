<template>
  <v-layout fill-height wrap>
    <v-flex/>
    <v-flex align-self-center class="text-center relative my-16" md5 mx5 sm6 xl4>
      <v-form class="mt-1" ref="form">
        <v-text-field v-model="old_password" color="primary" :label="$vuetify.lang.t('$vuetify.lang_175')" outlined :rules="rulesOldPassword" required>
          <template #message="{ message }">
            {{ $vuetify.lang.t(message) }}
          </template>
        </v-text-field>
        <v-text-field v-model="new_password" color="primary" :label="$vuetify.lang.t('$vuetify.lang_174')" outlined :rules="rulesNewPassword" required>
          <template #message="{ message }">
            {{ $vuetify.lang.t(message) }}
          </template>
        </v-text-field>
      </v-form>
      <v-btn block color="black--text yellow darken-1 text-capitalize" elevation="0" large @click="setUser">{{ $vuetify.lang.t('$vuetify.lang_176') }}</v-btn>
    </v-flex>
    <v-flex/>
  </v-layout>
</template>

<script>

  export default {
    data() {
      return {
        old_password: "",
        new_password: ""
      }
    },
    methods: {

      /**
       *
       */
      setUser() {
        if (!this.$refs.form.validate()) return false;
        this.$axios.$post(this.$api.account.setUser, {
          old_password: this.old_password,
          new_password: this.new_password
        }).then(() => {
          this.old_password = "";
          this.new_password = "";
          this.$snackbar.open({
            content: this.$vuetify.lang.t('$vuetify.lang_173'),
            color: 'green darken-2'
          });
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      }
    },
    computed: {
      rulesNewPassword() {
        return [
          (v) => !!v || '$vuetify.lang_171',
          (v) => v.length >= 8 || '$vuetify.lang_16'
        ]
      },
      rulesOldPassword() {
        return [
          (v) => !!v || '$vuetify.lang_172',
          (v) => v.length >= 8 || '$vuetify.lang_16'
        ]
      }
    }
  }
</script>

<style scoped>

</style>