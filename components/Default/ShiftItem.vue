<template>
  <div :class="('v-shift-item ') + (this.assigning === 'sell' ? '--sell' : '--buy')" :style="`height:${this.height}px`">
    <div class="v-shift-content">
      <slot name="default"></slot>
    </div>
    <div class="v-shift-progress" :style="`width:${this.width}%`" />
  </div>
</template>

<script>
  export default {
    name: "v-component-shift-item",
    data() {
      return {
        style: ''
      }
    },
    props: {
      height: {
        type: Number,
        default: 30
      },
      width: {
        type: Number,
        default: 0
      },
      assigning: {
        type: String,
        default: 'sell'
      }
    }
  }
</script>

<style lang="scss" scoped>

  .v-shift-item {
    width: 100%;
    display: flex;
    align-items: center;

    .v-shift-content {
      z-index: 4;
      margin: 0 15px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
    }

    .v-shift-progress {
      position: absolute;
      height: 100%;
      display: list-item;
      list-style: inside;
      color: transparent;
    }
  }

  .theme--light .v-shift-item.--buy {
      background-color: #d9fbef;
  }

  .theme--light .v-shift-item.--sell {
    background-color: #fff3f4;
  }

  .theme--light .v-shift-item > .v-shift-progress {
    background-color: #ffffff;
  }

  .theme--dark .v-shift-item.--buy {
    background-color: #192e2c;
  }

  .theme--dark .v-shift-item.--sell {
    background-color: #382626;
  }

  .theme--dark .v-shift-item > .v-shift-progress {
    background-color: #1e1e1e;
  }

</style>
