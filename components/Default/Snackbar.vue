<template>
  <div>
    <v-snackbar v-for="(item, index) in items" :ref="`item:${index}`" :key="index" v-model="item.show" :color="item.color" right bottom absolute timeout="-1" :style="(item.bottom ? 'bottom:' + item.bottom + 'px;' : '') + 'height: auto !important;'">
      <template v-slot:default>
        <span v-html="item.message"></span>
      </template>
      <template v-slot:action>
        <v-btn icon @click="item.show = false" right>
          <v-icon>
            mdi-close-circle-outline
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    name: "v-component-snackbar",
    data () {
      return {
        items: []
      }
    },
    created () {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'snackbar/open') {

          let item =  {
            show: false,
            message: '',
            color: '',
            bottom: 0,
            timeout: null
          }

          for (let i = 0; i < this.items.length; i++) {
            let refs = this.$refs[`item:${i}`];
            if (!refs || !refs[0]) {
              return
            }
            item.bottom += refs[0].$el.clientHeight;
          }

          item.timeout = setTimeout(() => this.getOffset(), 5000);
          item.message = state.snackbar.content;
          item.color = state.snackbar.color;
          item.show = true;

          this.items.unshift(item);
        }
      });
    },
    methods: {
      getOffset() {

        let height = 0;
        let latest = this.items.length - 1;

        let refs = this.$refs[`item:${latest}`];
        if (!refs || !refs[0]) {
          return
        }

        height = refs[0].$el.clientHeight;

        this.items[latest].show = false;
        this.items.splice(latest, 1);

        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].bottom > 0) {
            this.items[i].bottom -= height;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
