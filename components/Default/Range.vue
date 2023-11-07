<template>
  <div class="range-slider">
    <label class="label" :style="{left: `${range}%`, transform: `translateX(-${range - (range / 2)}%)`}" >{{range}}%</label>
    <input type="range" name="range-slider" min="0" max="100" v-model="range" :style="getValuePercent" @change="handleRange()">
    <div class="range-balls">
      <div v-for="index in $options.coloringBalls" :key="index" class="range-ball" :style="'background-color:' + (range > index ? (color ? '#d87a75' : '#66b4ac') : ($vuetify.theme.dark ? '#545454' : '#dddddd'))"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'v-component-range-slider',
    props: {
      eyelet: {
        type: Number
      },
      clear: {
        type: Boolean
      }
    },
    watch: {
      eyelet(a) {
        this.color = a;
        this.range = 0;
      },
      clear(c) {
        if (c) {
          this.range = 0;
        }
      }
    },
    data: () => ({
      range: 0,
      color: 0
    }),
    coloringBalls: [0, 25, 50, 75, 99],
    methods: {
      handleRange() {
        this.$emit('input', this.range)
      }
    },
    computed: {
      getValuePercent() {
        return {
          background: `linear-gradient(to right, ${this.color ? '#d87a75' : '#66b4ac'} ${this.range}%, ${(this.$vuetify.theme.dark ? '#545454' : '#dddddd')} ${this.range}%)`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .range-slider {
    position: relative;
  }
  .range-slider:hover .label {
    display: block;
  }
  .label {
    position: absolute;
    display: none;
    top: -25px;
    font-weight: 400;
    font-size: 12px;
    line-height: calc(18 / 12 * 100%);
  }
  .range-slider input {
    height: 4px;
    width: 100%;
    -webkit-appearance: none;
    position: relative;
    display: block;
    background-color: #ddd;
    z-index: 2;
    &::-webkit-slider-thumb {
      appearance: none;
      cursor: ew-resize;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2098f4;
    }
    &::-moz-range-thumb {
      appearance: none;
      cursor: ew-resize;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2098f4;
    }
  }
  .range-ball {
    position: absolute;
    top: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    z-index: 1;
    &:nth-child(1) {
      left: 0;
    }
    &:nth-child(2) {
      left: 24%;
    }
    &:nth-child(3) {
      left: 48%;
    }
    &:nth-child(4) {
      left: 72%;
    }
    &:nth-child(5) {
      left: calc(100% - 12px);
    }
  }
</style>