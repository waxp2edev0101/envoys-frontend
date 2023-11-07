<template>
  <div class="px-3 mt-3">

    <!-- Start: advertising info form -->
    <v-row>
      <v-col cols="12" md="4"></v-col>
      <v-col cols="12" md="4">

        <template v-if="item.pattern === 'sticker'">
          <div>{{ $vuetify.lang.t('$vuetify.lang_319') }}: 640x340</div>
          <div v-if="image">
            <v-img :src="image" />
          </div>
          <div v-else-if="item.id">
            <v-img :src="$storages(['ads'], item.id)"></v-img>
          </div>
          <v-form class="mt-2" ref="stick">
            <v-file-input counter chips show-size truncate-length="34" outlined @change="onChange" />
            <v-text-field v-model="item.link" color="primary" label="Link" outlined :rules="rulesLink" required>
              <template #message="{ message }">
                {{ $vuetify.lang.t(message) }}
              </template>
            </v-text-field>
          </v-form>
        </template>
        <template v-else>
          <v-form class="mt-2" ref="text">
            <v-text-field v-model="item.title" color="primary" :label="$vuetify.lang.t('$vuetify.lang_322')" outlined :rules="rulesTitle" required>
              <template #message="{ message }">
                {{ $vuetify.lang.t(message) }}
              </template>
            </v-text-field>
            <v-textarea v-model="item.text" color="primary" :label="$vuetify.lang.t('$vuetify.lang_323')" outlined :rules="rulesText" required>
              <template #message="{ message }">
                {{ $vuetify.lang.t(message) }}
              </template>
            </v-textarea>
            <v-text-field v-model="item.link" color="primary" :label="$vuetify.lang.t('$vuetify.lang_326')" outlined :rules="rulesLink" required>
              <template #message="{ message }">
                {{ $vuetify.lang.t(message) }}
              </template>
            </v-text-field>
          </v-form>
        </template>
        <v-select v-model="item.pattern" :items="types" item-text="name" item-value="value" :label="$vuetify.lang.t('$vuetify.lang_324')" outlined></v-select>

        <template v-if="$route.params.id === 'create'">
          <v-btn v-if="item.pattern === 'sticker' ? image : true" block color="black--text yellow darken-1 text-capitalize mb-3" elevation="0" large @click="setAdvertising">{{ $vuetify.lang.t('$vuetify.lang_320') }}</v-btn>
        </template>
        <template v-else>
          <v-btn block color="white--text red darken-1 text-capitalize mb-3" elevation="0" large @click="setAdvertising">{{ $vuetify.lang.t('$vuetify.lang_321') }}</v-btn>
        </template>

      </v-col>
      <v-col cols="12" md="4"></v-col>
    </v-row>
    <!-- End: advertising info form -->

  </div>
</template>

<script>
  export default {
    data() {
      return {
        types: [
          {value: 'text', name: 'Ad text'},
          {value: 'sticker', name: 'Ad sticker'},
        ],
        item: {
          id: 0,
          title: '',
          text: '',
          link: '',
          type: 'text'
        },
        image: "",
      }
    },
    mounted() {
      this.getAdvertising();
    },
    methods: {

      /**
       *
       */
      getAdvertising() {
        this.$axios.$post(this.$api.ads.getAdvertising, {
          id: (this.$route.params.id !== "create" ? this.$route.params.id : 0)
        }).then((response) => {
          this.item = Object.assign(this.item, response.fields[0]);
        });
      },

      /**
       *
       */
      setAdvertising() {
        if (this.item.type === 'sticker') {
          this.item.title = "";
          this.item.text = "";

          if (!this.$refs.stick.validate()) {
            return false
          }
        } else {
          if (!this.$refs.text.validate()) {
            return false
          }
        }

        this.$axios.$post(this.$api.admin.ads.setAdvertising, {
          image: this.image.split(',')[1],
          advertising: this.item
        }).then(() => {
          return this.$router.push('/admin/default/advertising');
        }).catch((error) => {
          this.$snackbar.open({
            content: `${error.response.data.code}: ${error.response.data.message}`,
            color: 'red darken-2'
          });
        });
      },

      /**
       * @param file
       */
      setImage(file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },

      /**
       * @param file
       */
      onChange(file) {
        if (!file) {
          this.image = "";
          return;
        }
        this.setImage(file);
      }
    },
    computed: {
      rulesLink() {
        return [
          (v) => !!v || '$vuetify.lang_317',
          (v) => /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(v) || '$vuetify.lang_318'
        ]
      },
      rulesText() {
        return [
          (v) => !!v || '$vuetify.lang_315',
          (v) => v.length >= 20 || '$vuetify.lang_316'
        ]
      },
      rulesTitle() {
        return [
          (v) => !!v || '$vuetify.lang_313',
          (v) => v.length >= 10 || '$vuetify.lang_314'
        ]
      }
    }
  }
</script>

<style scoped>

</style>