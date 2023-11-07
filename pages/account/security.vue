<template>
  <v-layout fill-height wrap>
    <v-flex/>
    <v-flex align-self-center class="text-center relative my-16" md5 mx5 sm6 xl4>

      <div class="text-h6 font-weight-black">{{ $vuetify.lang.t('$vuetify.lang_294') }}</div>
      <div>{{ $vuetify.lang.t('$vuetify.lang_297') }}</div>

      <v-card class="mt-4" outlined>
        <v-list height="76">
          <v-list-item>
            <v-list-item-avatar>
              <v-img src="/svg/2fa.svg" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $vuetify.lang.t('$vuetify.lang_298') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.lang_299') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-actions>
          <template v-if="factors.secure">
            <v-btn color="black--text yellow darken-1 text-capitalize" large block elevation="0" @click.stop="getFactor(1)">{{ $vuetify.lang.t('$vuetify.lang_300') }}</v-btn>
          </template>
          <template v-else>
            <v-btn color="white--text red lighten-1 text-capitalize" large block elevation="0" @click.stop="getFactor(2)">{{ $vuetify.lang.t('$vuetify.lang_301') }}</v-btn>
          </template>
        </v-card-actions>
      </v-card>

      <v-dialog v-model="dialogs.enable" width="500">
        <v-card>
          <v-card-title class="text-h5">
            {{ $vuetify.lang.t('$vuetify.lang_300') }} {{ $vuetify.lang.t('$vuetify.lang_302') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-layout wrap>
              <v-flex/>
              <v-flex align-self-center class="text-center relative">
                <div class="mt-4 qr-code">
                  <v-component-qrcode :content="factors.url" :width="150" />
                </div>
                <v-text-field id="copy" v-model="factors.secret" class="mt-4" color="primary" outlined :label="$vuetify.lang.t('$vuetify.lang_306')" hide-details>
                  <template v-slot:append>
                    <v-icon style="cursor: pointer;" @click="copy()">
                      mdi-clipboard-text-multiple-outline
                    </v-icon>
                  </template>
                </v-text-field>
                <div class="mt-2">{{ $vuetify.lang.t('$vuetify.lang_308') }}</div>
                <v-otp-input v-model="factors.code" length="6" />
                <v-btn class="mt-2" block color="black--text yellow darken-1 text-capitalize" elevation="0" @click="setFactor(1)" large>{{ $vuetify.lang.t('$vuetify.lang_309') }}</v-btn>
              </v-flex>
              <v-flex/>
            </v-layout>
          </v-card-text>
          <v-card-actions style="display: grid;" class="text-center grey lighten-3">
            <small class="my-4" v-html="$vuetify.lang.t('$vuetify.lang_307')"></small>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogs.disable" width="500">
        <v-card>
          <v-card-title class="text-h5">
            {{ $vuetify.lang.t('$vuetify.lang_301') }} {{ $vuetify.lang.t('$vuetify.lang_302') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="mt-2">{{ $vuetify.lang.t('$vuetify.lang_308') }}</div>
            <v-otp-input v-model="factors.code" length="6" />
            <v-btn class="mt-2" block color="black--text yellow darken-1 text-capitalize" elevation="0" @click="setFactor(2)" large>{{ $vuetify.lang.t('$vuetify.lang_310') }}</v-btn>
          </v-card-text>
          <v-card-actions style="display: grid;" class="text-center grey lighten-3">
            <small class="my-4">{{ $vuetify.lang.t('$vuetify.lang_311') }}</small>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-flex>
    <v-flex/>
  </v-layout>
</template>

<script>
  import Qrcode from "~/components/Qrcode";

  export default {
    components: {
      'v-component-qrcode': Qrcode
    },
    data() {
      return {
        dialogs: {
          enable: false,
          disable: false
        },
        factors: {
          secure: false,
          secret: '',
          url: '',
          code: ''
        }
      }
    },
    mounted() {
      this.getFactor(0);
    },
    methods: {
      copy() {
        document.getElementById("copy").select();
        document.execCommand("copy");
      },
      getFactor(exp) {
        this.$axios.$post(this.$api.account.getFactor).then((response) => {
          this.factors.code = '';
          if (response.secret && response.url) {
            this.factors.secret = response.secret;
            this.factors.url = response.url;
            this.factors.secure = true;
          }
          switch (exp) {
            case 1:
              this.dialogs.enable = true;
              break;
            case 2:
              this.dialogs.disable = true;
              break;
          }
        });
      },
      setFactor(exp) {
        this.$axios.$post(this.$api.account.setFactor, {secret: this.factors.secret, code: this.factors.code}).then(_ => {
          this.factors.secret = '';
          this.factors.code = '';
          this.factors.url = '';
          switch (exp) {
            case 1:
              this.dialogs.enable = false;
              this.factors.secure = false;
              break;
            case 2:
              this.dialogs.disable = false;
              this.factors.secure = true;
              break;
          }
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      }
    }
  }
</script>

<style>

  .qr-code > div > .v-image {
    margin: 0 auto;
  }

</style>