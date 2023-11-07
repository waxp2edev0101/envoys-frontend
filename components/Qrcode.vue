<template>
  <div v-if="image">
    <v-img :width="width" :src="image" />
  </div>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    name: "v-component-qrcode",
    props: {
      content: {
        type: String
      },
      width: {
        type: Number,
        default: 150
      }
    },
    data() {
      return {
        image: null
      }
    },
    mounted() {
      QRCode.toDataURL(this.content, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 0,
        color: {
          dark: "#1e1e1e",
          light: "#ffffff"
        }
      }).then(url => {
          this.image = url;
      });
    }
  }
</script>

<style scoped>

</style>
