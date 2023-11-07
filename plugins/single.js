import {Howl} from "howler";

export default ({ app, store }, inject) => {

  /**
   * @type {{play(*): void}}
   */
  app.$single = {

    /**
     * @param name
     */
    play(name) {
      const player = new Howl({
        src: `${app.$axios.defaults.baseURL}/v2/storage/media/${name}.ogg`,
        html5: true,
        autoplay: false,
        loop: false,
        volume: 0.5,
        preload: false
      });
      player.play(0, false);
    }
  };
  inject('single', app.$single);
};
